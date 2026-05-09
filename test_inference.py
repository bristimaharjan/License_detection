import argparse, json, csv, re, os
from ultralytics import YOLO
from PIL import Image
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import date

def clamp(v, lo=0.0, hi=1.0):
    return max(lo, min(hi, v))

def iou_xyxy(a, b):
    ax1, ay1, ax2, ay2 = a
    bx1, by1, bx2, by2 = b
    ix1 = max(ax1, bx1)
    iy1 = max(ay1, by1)
    ix2 = min(ax2, bx2)
    iy2 = min(ay2, by2)
    iw = max(0.0, ix2 - ix1)
    ih = max(0.0, iy2 - iy1)
    inter = iw * ih
    area_a = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)
    area_b = max(0.0, bx2 - bx1) * max(0.0, by2 - by1)
    union = area_a + area_b - inter
    return 0.0 if union <= 0 else inter / union

def load_gt_boxes(annotations_dir, original_name):
    if not original_name:
        return []
    stem = Path(original_name).stem
    xml_path = Path(annotations_dir) / f'{stem}.xml'
    if not xml_path.exists():
        return []
    tree = ET.parse(xml_path)
    root = tree.getroot()
    boxes = []
    for obj in root.findall('object'):
        b = obj.find('bndbox')
        if b is None:
            continue
        x1 = float(b.findtext('xmin', '0'))
        y1 = float(b.findtext('ymin', '0'))
        x2 = float(b.findtext('xmax', '0'))
        y2 = float(b.findtext('ymax', '0'))
        if x2 > x1 and y2 > y1:
            boxes.append([x1, y1, x2, y2])
    return boxes

def extract_plate_text(image_path, bbox):
    try:
        import easyocr
        reader = easyocr.Reader(['en'], gpu=True, verbose=False)
        img = Image.open(image_path).convert('RGB')
        x1, y1, x2, y2 = [int(v) for v in bbox]
        plate_crop = img.crop((x1, y1, x2, y2))
        import numpy as np
        plate_np = np.array(plate_crop)
        results = reader.readtext(plate_np, detail=0)
        text = ' '.join(results).strip().upper()
        text = re.sub(r'[^A-Z0-9\s\-.]', '', text)
        return text if text else ''
    except Exception as e:
        print(f"DEBUG: OCR Error: {e}")
        return ''

OCR_CONFUSABLES = {
    'G': '6', '6': '6',
    'O': '0', '0': '0', 'D': '0', 'Q': '0',
    'I': '1', '1': '1', 'L': '1',
    'B': '8', '8': '8',
    'S': '5', '5': '5',
    'Z': '2', '2': '2',
}

def ocr_canonical(text):
    out = []
    for ch in re.sub(r'[^A-Z0-9]', '', text.upper()):
        out.append(OCR_CONFUSABLES.get(ch, ch))
    return ''.join(out)

def levenshtein(s1, s2):
    if len(s1) < len(s2):
        return levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)
    prev_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        curr_row = [i + 1]
        for j, c2 in enumerate(s2):
            cost = 0 if c1 == c2 else 1
            curr_row.append(min(curr_row[j] + 1, prev_row[j + 1] + 1, prev_row[j] + cost))
        prev_row = curr_row
    return prev_row[-1]

def build_match_result(row):
    today = date.today().isoformat()
    reg_status = 'Valid' if row['reg_expiry'] >= today else 'Expired'
    return {
        'plate_number': row['plate_number'],
        'owner_name': row['owner_name'],
        'address': row['address'],
        'vehicle_year': int(row['vehicle_year']),
        'vehicle_make': row['vehicle_make'],
        'vehicle_model': row['vehicle_model'],
        'vehicle_color': row['vehicle_color'],
        'reg_expiry': row['reg_expiry'],
        'reg_status': reg_status,
        'insurance': row['insurance'],
        'insurance_provider': row.get('insurance_provider', ''),
        'policy_number': row.get('policy_number', ''),
        'fines': int(row['fines']),
        'fine_amount': int(row['fine_amount']),
        'is_flagged': row['is_flagged'] == 'True'
    }

def lookup_vehicle(plate_text, csv_path):
    if not plate_text or not os.path.exists(csv_path):
        return None
    try:
        normalized_query = re.sub(r'[^A-Z0-9]', '', plate_text.upper())
        canonical_query = ocr_canonical(plate_text)
        rows = []
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                np_ = re.sub(r'[^A-Z0-9]', '', row['plate_number'].upper())
                if np_ == normalized_query:
                    return build_match_result(row)
                rows.append((np_, row))
        for np_, row in rows:
            if ocr_canonical(row['plate_number']) == canonical_query:
                return build_match_result(row)
        best_dist = 3
        best_row = None
        for np_, row in rows:
            if abs(len(np_) - len(normalized_query)) <= 1:
                dist = levenshtein(np_, normalized_query)
                if dist < best_dist:
                    best_dist = dist
                    best_row = row
        if best_row:
            return build_match_result(best_row)
    except Exception:
        pass
    return None

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--image', required=True)
    parser.add_argument('--model-path', required=True)
    parser.add_argument('--annotations-dir', required=True)
    parser.add_argument('--original-name', default='')
    parser.add_argument('--vehicles-csv', default='')
    args = parser.parse_args()

    print(f"Loading model from {args.model_path}")
    model = YOLO(args.model_path)
    
    print(f"Predicting on {args.image}")
    pred = model.predict(source=args.image, conf=0.25, verbose=False)[0]
    
    img = Image.open(args.image).convert('RGB')
    w, h = img.size
    print(f"Image size: {w}x{h}")

    detections = []
    if pred.boxes is not None:
        xyxy = pred.boxes.xyxy.cpu().tolist()
        conf = pred.boxes.conf.cpu().tolist() if pred.boxes.conf is not None else [0.0] * len(xyxy)
        cls = pred.boxes.cls.cpu().tolist() if pred.boxes.cls is not None else [0.0] * len(xyxy)
        for box, score, c in zip(xyxy, conf, cls):
            x1, y1, x2, y2 = [float(v) for v in box]
            name = pred.names.get(int(c), str(int(c))) if isinstance(pred.names, dict) else str(int(c))
            detections.append({
                'class_name': name,
                'confidence': float(score),
                'bbox_xyxy': [x1, y1, x2, y2],
                'bbox_normalized': [clamp(x1 / w), clamp(y1 / h), clamp(x2 / w), clamp(y2 / h)]
            })

    print(f"Detections found: {len(detections)}")
    plate_text = ''
    if detections:
        best_det = max(detections, key=lambda d: d['confidence'])
        print(f"Running OCR on best detection: {best_det['bbox_xyxy']}")
        plate_text = extract_plate_text(args.image, best_det['bbox_xyxy'])
        print(f"OCR Result: {plate_text}")

    vehicle = lookup_vehicle(plate_text, args.vehicles_csv) if plate_text else None
    if vehicle:
        print(f"Vehicle found: {vehicle['plate_number']}")

    gt_boxes = load_gt_boxes(args.annotations_dir, args.original_name)
    best_iou = None
    if detections and gt_boxes:
        max_iou = 0.0
        for d in detections:
            for g in gt_boxes:
                max_iou = max(max_iou, iou_xyxy(d['bbox_xyxy'], g))
        best_iou = float(max_iou)

    payload = {
        'prediction': detections[0]['class_name'] if detections else 'none',
        'plate_text': plate_text,
        'detections': detections,
        'image_size': {'width': int(w), 'height': int(h)},
        'iou_score': best_iou,
        'is_correct': (best_iou >= 0.5) if best_iou is not None else None,
        'vehicle': vehicle
    }
    print("PAYLOAD START")
    print(json.dumps(payload))
    print("PAYLOAD END")

if __name__ == "__main__":
    main()

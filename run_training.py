#!/usr/bin/env python
"""
Training script for YOLO license plate detection model
"""
import json
import random
import shutil
import xml.etree.ElementTree as ET
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt
from PIL import Image
import torch

try:
    from ultralytics import YOLO
except ImportError:
    import sys
    import subprocess
    print("Installing ultralytics...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "ultralytics"])
    from ultralytics import YOLO

# Configuration
SEED = 42
TRAIN_RATIO = 0.70
VAL_RATIO = 0.15
TEST_RATIO = 0.15

IMG_SIZE = 640
BATCH_SIZE = 16
EPOCHS = 80
BASE_MODEL = "yolov8s.pt"
RUN_NAME = "plate_yolov8s"

def find_project_root(start: Path) -> Path:
    for candidate in [start, *start.parents]:
        if (candidate / "data").exists() and (candidate / "ml").exists():
            return candidate
    raise FileNotFoundError("Could not find project root containing data/ and ml/")

PROJECT_ROOT = find_project_root(Path.cwd().resolve())
ANNOTATIONS_DIR = PROJECT_ROOT / "data" / "annotations"
IMAGES_DIR = PROJECT_ROOT / "data" / "images"
ARTIFACTS_DIR = PROJECT_ROOT / "ml" / "artifacts"
YOLO_DATASET_DIR = ARTIFACTS_DIR / "yolo_plate_dataset"
YOLO_RUNS_DIR = ARTIFACTS_DIR / "yolo_runs"

ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
YOLO_RUNS_DIR.mkdir(parents=True, exist_ok=True)

random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)

train_device = 0 if torch.cuda.is_available() else "cpu"
print(f"Project root: {PROJECT_ROOT}")
print(f"Train device: {train_device}")
print(f"GPU Available: {torch.cuda.is_available()}")
print(f"Annotations dir exists: {ANNOTATIONS_DIR.exists()}")
print(f"Images dir exists: {IMAGES_DIR.exists()}")

# Parse XML
def parse_xml_record(xml_path: Path):
    tree = ET.parse(xml_path)
    root = tree.getroot()

    filename = root.findtext("filename")
    size = root.find("size")
    if filename is None or size is None:
        return None

    width = float(size.findtext("width"))
    height = float(size.findtext("height"))
    if width <= 0 or height <= 0:
        return None

    image_path = IMAGES_DIR / filename
    if not image_path.exists():
        return None

    boxes = []
    for obj in root.findall("object"):
        bbox = obj.find("bndbox")
        if bbox is None:
            continue

        xmin = max(0.0, min(1.0, float(bbox.findtext("xmin")) / width))
        ymin = max(0.0, min(1.0, float(bbox.findtext("ymin")) / height))
        xmax = max(0.0, min(1.0, float(bbox.findtext("xmax")) / width))
        ymax = max(0.0, min(1.0, float(bbox.findtext("ymax")) / height))

        if 0 <= xmin < xmax <= 1 and 0 <= ymin < ymax <= 1:
            boxes.append([xmin, ymin, xmax, ymax])

    return {
        "image_path": image_path,
        "boxes": boxes,
        "width": width,
        "height": height,
    }

print("\n=== Parsing annotations ===")
xml_files = sorted(ANNOTATIONS_DIR.glob("*.xml"))
records = [parse_xml_record(f) for f in xml_files]
records = [r for r in records if r is not None]
print(f"Valid records: {len(records)}/{len(xml_files)}")

# Split train/val/test
random.shuffle(records)
n_train = int(len(records) * TRAIN_RATIO)
n_val = int(len(records) * VAL_RATIO)

train_records = records[:n_train]
val_records = records[n_train : n_train + n_val]
test_records = records[n_train + n_val :]

print(f"Train: {len(train_records)}, Val: {len(val_records)}, Test: {len(test_records)}")

# Create YOLO dataset structure
def create_yolo_split(records, split_name):
    split_dir = YOLO_DATASET_DIR / split_name
    img_dir = split_dir / "images"
    labels_dir = split_dir / "labels"
    img_dir.mkdir(parents=True, exist_ok=True)
    labels_dir.mkdir(parents=True, exist_ok=True)

    for i, record in enumerate(records):
        src_img = record["image_path"]
        dst_img = img_dir / src_img.name
        shutil.copy(src_img, dst_img)

        label_file = labels_dir / (src_img.stem + ".txt")
        with open(label_file, "w") as f:
            for box in record["boxes"]:
                xmin, ymin, xmax, ymax = box
                cx = (xmin + xmax) / 2
                cy = (ymin + ymax) / 2
                w = xmax - xmin
                h = ymax - ymin
                f.write(f"0 {cx} {cy} {w} {h}\n")

    print(f"Created {split_name} split: {len(records)} images")

print("\n=== Creating YOLO dataset structure ===")
create_yolo_split(train_records, "train")
create_yolo_split(val_records, "val")
create_yolo_split(test_records, "test")

# Create data.yaml
data_yaml = YOLO_DATASET_DIR / "data.yaml"
with open(data_yaml, "w") as f:
    f.write(f"""path: {YOLO_DATASET_DIR}
train: train/images
val: val/images
test: test/images
nc: 1
names: ['plate']
""")

print(f"Created data.yaml: {data_yaml}")

# Train YOLO
print("\n=== Starting YOLO training ===")
model = YOLO(BASE_MODEL)
results = model.train(
    data=str(data_yaml),
    epochs=EPOCHS,
    imgsz=IMG_SIZE,
    batch=BATCH_SIZE,
    device=train_device,
    project=str(YOLO_RUNS_DIR),
    name=RUN_NAME,
    patience=10,
    save=True,
    verbose=True,
)

print("\n=== Training complete ===")
print(f"Results: {results}")
print(f"Best model saved to: {YOLO_RUNS_DIR / RUN_NAME}")

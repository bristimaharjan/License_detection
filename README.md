# License Plate ML System (KNN + API + Next.js)

For CUDA-enabled PyTorch notebook setup, see `ml/CUDA_SETUP.md`.

This repository extends the original OpenCV plate project into a full, production-oriented system with:

- ML pipeline (`ml/`) for training and evaluation (KNN)
- Backend API (`backend/`) using Node.js + Express + TypeScript
- Frontend app (`frontend/`) using Next.js + TypeScript
- Data workflow (`data/`) with Kaggle integration instructions

## Project Structure

```text
.
├─ OpenCV_3_License_Plate_Recognition_Python/   # Original codebase preserved
├─ ml/
│  ├─ artifacts/                                # Trained model + metrics + plots
│  ├─ notebooks/                                # Jupyter workflow
│  ├─ scripts/                                  # Dataset utility scripts
│  └─ src/                                      # Training + inference modules
├─ backend/
│  └─ src/                                      # Express API
├─ frontend/
│  └─ app/                                      # Next.js UI
├─ data/
│  ├─ raw/
│  ├─ processed/
│  └─ sample_images/
└─ environment.yml
```

## 1. Conda Environment Setup

```bash
conda env create -f+ environment.yml
conda activate lpr-knn
```

## 2. Dataset Setup (Kaggle)

Create Kaggle API credentials at `~/.kaggle/kaggle.json`, then:

```bash
python ml/scripts/download_kaggle_dataset.py --dataset <owner/dataset-name> --output-dir data/raw
```

Training expects a folder-per-class structure under `data/raw/character_dataset`.

### Demo Dataset from Legacy Files

A conversion script is included to build a demo character dataset from the legacy files:

```bash
python ml/scripts/build_demo_dataset_from_legacy.py
```

## 3. Train the KNN Model

```bash
python -m ml.src.train --dataset-dir data/raw/character_dataset --artifacts-dir ml/artifacts
```

Outputs:

- `ml/artifacts/knn_model.joblib`
- `ml/artifacts/metrics.json`
- `ml/artifacts/classification_report.json`
- `ml/artifacts/seed_evaluation.json`
- `ml/artifacts/confusion_matrix.png`

## 4. Run Notebook

Notebook path:

- `ml/notebooks/knn_training_workflow.ipynb`

Run Jupyter:

```bash
jupyter notebook
```

## 5. Backend (Node.js + TypeScript)

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend endpoints:

- `GET /health`
- `GET /api/metrics` (metrics + classification report + random-seed evaluation)
- `GET /api/samples` (demo sample image list)
- `POST /api/predict` (multipart form-data field: `image`)

### Example API Request

```bash
curl -X POST http://localhost:4000/api/predict \
  -F "image=@data/sample_images/sample_1.png"
```

## 6. Frontend (Next.js + TypeScript)

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open: `http://localhost:3000`

The UI supports drag-and-drop upload, preview, and inference result display.

## 7. End-to-End Flow

1. Train model in `ml/`
2. Start backend on port 4000
3. Start frontend on port 3000
4. Upload image in UI
5. Backend runs Python inference (`ml/src/infer.py`) and returns JSON
6. Frontend displays predicted class and optional probability scores


## 8. Current Artifact Snapshot

Latest generated metrics (demo dataset):

- Accuracy: `0.8889`
- Precision (weighted): `0.8565`
- Recall (weighted): `0.8889`
- F1 (weighted): `0.8657`
- Best KNN params: `n_neighbors=1, weights=uniform, metric=minkowski`

## 9. Notes for Production

- Replace demo dataset with a larger, real Kaggle dataset for robust generalization.
- Add model/version registry and experiment tracking (MLflow or similar).
- Add backend authentication/rate-limiting for public deployment.
- Add CI checks for linting, tests, and model quality thresholds.

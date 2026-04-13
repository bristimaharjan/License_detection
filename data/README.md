# Data Directory

## Layout

- `raw/`: Kaggle dataset files and extracted training data
- `processed/`: Optional intermediate processed files
- `sample_images/`: Sample images for API/frontend inference demos

## Kaggle Download

1. Install Kaggle CLI (`pip install kaggle`)
2. Add credentials at `~/.kaggle/kaggle.json`
3. Run:

```bash
python ml/scripts/download_kaggle_dataset.py --dataset <owner/dataset-name> --output-dir data/raw
```

## Expected Training Format

The KNN training script expects class folders:

```text
data/raw/character_dataset/
  A/
    img001.png
  B/
    img002.png
  ...
```

If your Kaggle dataset uses a different layout, convert it into this format before training.

CUDA Environment Setup (Windows, Conda)

Goal
- Run the notebook on NVIDIA GPU with PyTorch CUDA.

Prerequisites
- NVIDIA GPU with current driver installed
- Conda or Miniconda installed

1) Check GPU driver visibility
- Open PowerShell in project root and run:
  nvidia-smi
- If this fails, install/update NVIDIA driver first.

2) Create CUDA environment
- From project root:
  conda env create -f environment.yml

3) Activate environment
- PowerShell:
  conda activate isurance-ml-cuda

4) Register Jupyter kernel
- Run:
  python -m ipykernel install --user --name isurance-ml-cuda --display-name "Python (isurance-ml-cuda)"

5) Start notebook
- Run:
  jupyter notebook
- Open:
  ml/notebooks/pytorch_plate_bbox_training.ipynb
- In Notebook kernel picker, choose:
  Python (isurance-ml-cuda)

6) Verify CUDA in notebook
- In a code cell run:
  import torch
  print("cuda available:", torch.cuda.is_available())
  if torch.cuda.is_available():
      print("device:", torch.cuda.get_device_name(0))

Expected
- cuda available: True
- device name printed

If CUDA shows False
- Confirm you launched Jupyter from the same conda env.
- Re-check driver with nvidia-smi.
- Recreate env:
  conda env remove -n isurance-ml-cuda
  conda env create -f environment.yml

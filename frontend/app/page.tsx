"use client";

import { useEffect, useMemo, useState } from "react";

import {
  fetchModelMetrics,
  fetchSampleImages,
  predictImage,
  toApiUrl,
  type MetricsResponse,
  type PredictionResponse,
  type SampleImage,
} from "../lib/api";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatMetric(value: unknown): string {
  return isFiniteNumber(value) ? value.toFixed(4) : "-";
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [samples, setSamples] = useState<SampleImage[]>([]);
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleImage | null>(null);

  useEffect(() => {
    const nextUrl = file ? URL.createObjectURL(file) : null;
    setPreviewUrl(nextUrl);
    return () => {
      if (nextUrl) {
        URL.revokeObjectURL(nextUrl);
      }
    };
  }, [file]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [metricsPayload, samplePayload] = await Promise.all([fetchModelMetrics(), fetchSampleImages()]);
        setMetrics(metricsPayload);
        setSamples(samplePayload);
      } catch (loadError) {
        const message = loadError instanceof Error ? loadError.message : String(loadError);
        setMetricsError(message);
        setSampleError(message);
      }
    }

    void loadInitialData();
  }, []);

  const onSelectFile = (selected: File | null) => {
    setFile(selected);
    setResult(null);
    setError(null);
    setSelectedSample(null);
  };

  const handleDrop: React.DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0] ?? null;
    onSelectFile(droppedFile);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const prediction = await predictImage(file);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePredictSample = async (sample: SampleImage) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(toApiUrl(sample.url));
      if (!response.ok) {
        throw new Error(`Failed to fetch ${sample.name}: status ${response.status}`);
      }
      const blob = await response.blob();
      const sampleFile = new File([blob], sample.name, {
        type: blob.type || "image/png",
      });
      onSelectFile(sampleFile);
      setSelectedSample(sample);
      const prediction = await predictImage(sampleFile);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const yoloMetricsEntries = useMemo(() => {
    const values = metrics?.yolo_summary?.metrics;
    if (!values) {
      return [] as Array<[string, unknown]>;
    }
    return Object.entries(values).filter(([, value]) => typeof value !== "object");
  }, [metrics]);

  const splitEntries = useMemo(() => {
    const values = metrics?.yolo_summary?.splits;
    if (!values) {
      return [] as Array<[string, unknown]>;
    }
    return Object.entries(values);
  }, [metrics]);

  return (
    <main>
      <h1 className="title">License Plate Detection - Backend Inference</h1>
      <p className="subtitle">
        Upload an image and run backend YOLO inference. The UI displays live detections and model metrics.
      </p>

      <div className="grid">
        <section className="panel">
          <h3 style={{ marginTop: 0 }}>Inference</h3>
          <div
            className={`dropzone ${isDragging ? "dragging" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <p>Drop one vehicle image, or test with quick dataset samples below</p>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => onSelectFile(event.target.files?.[0] ?? null)}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button className="button" onClick={handleSubmit} disabled={loading || !file}>
              {loading ? "Running Inference..." : "Predict"}
            </button>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ marginBottom: "0.45rem" }}>Quick Sample Tests</h4>
            {sampleError ? <p className="subtitle">{sampleError}</p> : null}
            <div className="sampleList">
              {samples.map((sample) => (
                <button
                  className="chip"
                  key={sample.name}
                  onClick={() => {
                    void handlePredictSample(sample);
                  }}
                  disabled={loading}
                >
                  Test {sample.expectedLabel ?? sample.name}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className="error" style={{ marginTop: "1rem" }}>
              <strong>Error:</strong>
              <p>{error}</p>
            </div>
          ) : null}

          {result ? (
            <div className="result" style={{ marginTop: "1rem" }}>
              <h3 style={{ marginTop: 0 }}>Prediction Result</h3>
              <p>
                <strong>Filename:</strong> {result.filename}
              </p>
              <p>
                <strong>Predicted Class:</strong> {result.prediction}
              </p>
              <p>
                <strong>Detections:</strong> {result.detections.length}
              </p>
              <p>
                <strong>IoU Score:</strong> {result.iou_score === null ? "N/A" : result.iou_score.toFixed(4)}
              </p>
              <p>
                <strong>Correct (IoU &gt;= 0.50):</strong>{" "}
                {result.is_correct === null ? "N/A" : result.is_correct ? "Yes" : "No"}
              </p>
              {selectedSample ? (
                <p>
                  <strong>Sample:</strong> {selectedSample.name}
                </p>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="panel">
          <h3 style={{ marginTop: 0 }}>Preview</h3>
          {previewUrl ? (
            <div className="previewWrap">
              <img src={previewUrl} alt="Uploaded preview" className="preview" />
              {result?.detections.map((det, index) => {
                const [x1, y1, x2, y2] = det.bbox_normalized;
                return (
                  <div
                    key={`${det.class_name}-${index}`}
                    className="detBox"
                    style={{
                      left: `${(x1 * 100).toFixed(2)}%`,
                      top: `${(y1 * 100).toFixed(2)}%`,
                      width: `${((x2 - x1) * 100).toFixed(2)}%`,
                      height: `${((y2 - y1) * 100).toFixed(2)}%`,
                    }}
                  >
                    <span className="detLabel">
                      {det.class_name} {det.confidence.toFixed(3)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="subtitle">No image selected.</p>
          )}

          {result?.detections?.length ? (
            <div style={{ marginTop: "1rem" }} className="detectionList">
              <h4>Detections</h4>
              {result.detections.map((det, idx) => (
                <p key={`${det.class_name}-${idx}`}>
                  {det.class_name}: conf {det.confidence.toFixed(4)} | box [{det.bbox_xyxy
                    .map((v) => v.toFixed(1))
                    .join(", ")}]
                </p>
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <section className="panel" style={{ marginTop: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Model Metrics</h3>
        {metricsError ? <p className="subtitle">{metricsError}</p> : null}

        <div className="result" style={{ marginBottom: "1rem" }}>
          <p style={{ margin: 0 }}>
            <strong>Overall Accuracy:</strong>{" "}
            {formatMetric(metrics?.yolo_summary?.metrics?.overall_accuracy ?? null)}
          </p>
          <p className="metricSub" style={{ marginTop: "0.35rem" }}>
            Detection accuracy is reported as mAP@0.50 for this single-class model.
          </p>
        </div>

        <div className="metricsGrid">
          {yoloMetricsEntries.map(([label, value]) => (
            <div key={label} className="metricCard">
              <p className="metricLabel">{label}</p>
              <p className="metricValue">{formatMetric(value)}</p>
            </div>
          ))}
        </div>

        {splitEntries.length > 0 ? (
          <div style={{ marginTop: "1rem" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>Dataset Splits</h4>
            <div className="metricsGrid">
              {splitEntries.map(([name, value]) => {
                return (
                  <div className="metricCard" key={name}>
                    <p className="metricLabel">{name}</p>
                    <p className="metricValue">{isFiniteNumber(value) ? value.toFixed(0) : "-"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div style={{ marginTop: "1rem" }}>
          <p className="metricSub">Model: {metrics?.yolo_summary?.model_name ?? "-"}</p>
          <p className="metricSub">Run: {metrics?.yolo_summary?.run_name ?? "-"}</p>
          <p className="metricSub">Image Size: {metrics?.yolo_summary?.img_size ?? "-"}</p>
          <p className="metricSub">Epochs: {metrics?.yolo_summary?.epochs ?? "-"}</p>
        </div>
      </section>
    </main>
  );
}

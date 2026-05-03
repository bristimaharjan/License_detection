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
} from "../../lib/api";

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function formatMetric(value: unknown): string {
  return isFiniteNumber(value) ? value.toFixed(4) : "-";
}

export default function GetStartedPage() {
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
      if (nextUrl) URL.revokeObjectURL(nextUrl);
    };
  }, [file]);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [metricsPayload, samplePayload] = await Promise.all([
          fetchModelMetrics(),
          fetchSampleImages(),
        ]);
        setMetrics(metricsPayload);
        setSamples(samplePayload);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setMetricsError(msg);
        setSampleError(msg);
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
    onSelectFile(event.dataTransfer.files?.[0] ?? null);
  };

  const handleSubmit = async () => {
    if (!file) return setError("Please select an image first.");
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
      const res = await fetch(toApiUrl(sample.url));
      if (!res.ok) throw new Error("Failed to fetch sample");
      const blob = await res.blob();
      const file = new File([blob], sample.name);
      onSelectFile(file);
      setSelectedSample(sample);
      const prediction = await predictImage(file);
      setResult(prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const splitEntries = useMemo(() => {
    const values = metrics?.yolo_summary?.splits;
    return values ? Object.entries(values) : [];
  }, [metrics]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
        License Plate Detection
      </h1>
      <p className="text-gray-600 mb-6">
        Upload an image and run backend YOLO inference with live detection preview.
      </p>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="bg-white rounded-2xl border shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Inference</h3>

          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              isDragging
                ? "border-orange-500 ring-4 ring-orange-200"
                : "border-gray-300"
            }`}
          >
            <p className="text-sm text-gray-600 mb-2">
              Drop an image or upload below
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading || !file}
            className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Running..." : "Predict"}
          </button>

          {/* Samples */}
          <div className="mt-5">
            <h4 className="font-medium mb-2">Quick Samples</h4>
            <div className="flex flex-wrap gap-2">
              {samples.map((s) => (
                <button
                  key={s.name}
                  onClick={() => handlePredictSample(s)}
                  className="px-3 py-1 rounded-full border text-sm hover:bg-gray-100"
                >
                  {s.expectedLabel ?? s.name}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 bg-red-100 border border-red-300 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-4 bg-green-50 border border-green-200 p-4 rounded-lg text-sm">
              <p><b>Prediction:</b> {result.prediction}</p>
              <p><b>Detections:</b> {result.detections.length}</p>
              <p><b>IoU:</b> {result.iou_score?.toFixed(4) ?? "N/A"}</p>
            </div>
          )}
        </section>

        {/* RIGHT PANEL */}
        <section className="bg-white rounded-2xl border shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Preview</h3>

          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                className="rounded-lg w-full max-h-[400px] object-contain border"
              />

              {result?.detections.map((det, i) => {
                const [x1, y1, x2, y2] = det.bbox_normalized;
                return (
                  <div
                    key={i}
                    className="absolute border-2 border-red-500"
                    style={{
                      left: `${x1 * 100}%`,
                      top: `${y1 * 100}%`,
                      width: `${(x2 - x1) * 100}%`,
                      height: `${(y2 - y1) * 100}%`,
                    }}
                  >
                    <span className="absolute -top-5 bg-black text-white text-xs px-1 rounded">
                      {det.class_name} {det.confidence.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No image selected</p>
          )}
        </section>
      </div>

      {/* METRICS */}
      <section className="mt-8 bg-white rounded-2xl border shadow p-5">
        <h3 className="text-lg font-semibold mb-4">Model Metrics</h3>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-3 border rounded-lg">
            <p className="text-sm text-gray-500">Accuracy</p>
            <p className="font-bold">
              {formatMetric(metrics?.yolo_summary?.metrics?.overall_accuracy)}
            </p>
          </div>

          <div className="p-3 border rounded-lg">
            <p className="text-sm text-gray-500">Precision</p>
            <p className="font-bold">
              {formatMetric(metrics?.yolo_summary?.metrics?.test_precision)}
            </p>
          </div>

          <div className="p-3 border rounded-lg">
            <p className="text-sm text-gray-500">Recall</p>
            <p className="font-bold">
              {formatMetric(metrics?.yolo_summary?.metrics?.test_recall)}
            </p>
          </div>
        </div>

        {/* Dataset splits */}
        {splitEntries.length > 0 && (
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {splitEntries.map(([name, value]) => (
              <div key={name} className="p-3 border rounded-lg">
                <p className="text-sm text-gray-500">{name}</p>
                <p className="font-bold">
                  {isFiniteNumber(value) ? value : "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
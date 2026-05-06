"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

/* ── Sample image definitions ─────────────────────────────────────── */
const SAMPLES = [
  {
    src: "/samples/flagged_audi.png",
    label: "Flagged",
    sublabel: "Audi R8 · G526JHD",
    badge: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  {
    src: "/samples/expired_suzuki.png",
    label: "Expired",
    sublabel: "Suzuki Ciaz · KL01CA2555",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    src: "/samples/clear_subaru.png",
    label: "Clear",
    sublabel: "Subaru Levorg · DZ17YXR",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    src: "/samples/clear_toyota.png",
    label: "Clear",
    sublabel: "Toyota Innova · TN37CS2765",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  {
    src: "/samples/expired_vw.png",
    label: "Expired",
    sublabel: "VW Polo · MH01AV8866",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
];

/* ── Props ────────────────────────────────────────────────────────── */
interface UploadCardProps {
  onPredict: (file: File) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function UploadCard({ onPredict, loading, error }: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    onPredict(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  /** Fetch a sample image from public/, convert to File, and submit */
  const handleSampleClick = async (src: string) => {
    if (loading) return;
    setLoadingSample(src);
    try {
      const res = await fetch(src);
      const blob = await res.blob();
      const name = src.split("/").pop() || "sample.png";
      const file = new File([blob], name, { type: blob.type });
      handleFile(file);
    } catch {
      console.error("Failed to load sample image");
    } finally {
      setLoadingSample(null);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 w-full">
      <h3 className="text-lg font-semibold text-[#2563EB]">
        Upload Vehicle Photo
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        JPEG, PNG, WEBP — max 10 MB
      </p>

      {/* ── Drop Zone ── */}
      <div
        onClick={handleClick}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center bg-white cursor-pointer transition
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
          ${loading ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            {loading ? (
              <svg
                className="w-6 h-6 text-blue-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : (
              <PhotoIcon className="w-6 h-6 text-gray-400" />
            )}
          </div>
        </div>

        {loading ? (
          <>
            <p className="text-blue-600 font-medium">Analyzing image…</p>
            <p className="text-sm text-gray-500 mt-1">
              Running plate detection &amp; OCR. This may take a moment.
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-700 font-medium">
              Drag &amp; drop vehicle photo here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse from your device
            </p>
          </>
        )}

        {!loading && (
          <button
            type="button"
            className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 mx-auto transition-colors"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Choose Photo
          </button>
        )}

        {fileName && !loading && (
          <p className="mt-4 text-sm text-green-600">
            Selected: {fileName}
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">
            Error: {error}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* ── Quick Test Samples ── */}
      <div className="mt-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700">Quick Test Samples</p>
          <span className="text-xs text-gray-400">— click any to scan instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SAMPLES.map((sample) => {
            const isLoadingThis = loadingSample === sample.src;
            return (
              <button
                key={sample.src}
                onClick={() => handleSampleClick(sample.src)}
                disabled={loading}
                className={`group relative rounded-xl overflow-hidden border-2 transition-all
                  ${loading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400 hover:shadow-md cursor-pointer"}
                  ${isLoadingThis ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200"}
                `}
              >
                {/* Thumbnail */}
                <div className="relative w-full h-20 bg-gray-100">
                  <Image
                    src={sample.src}
                    alt={sample.sublabel}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="120px"
                  />
                  {isLoadingThis && (
                    <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="p-2 bg-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`w-2 h-2 rounded-full ${sample.dot}`} />
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${sample.badge}`}>
                      {sample.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">{sample.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
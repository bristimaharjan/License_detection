"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

/* ── Sample images (no hardcoded status — the DB determines status) ── */
const SAMPLES = [
  { src: "/samples/flagged_audi.png", plate: "G526JHD", vehicle: "Audi R8" },
  { src: "/samples/expired_suzuki.png", plate: "KL01CA2555", vehicle: "Suzuki Ciaz" },
  { src: "/samples/clear_subaru.png", plate: "DZ17YXR", vehicle: "Subaru Levorg" },
  { src: "/samples/clear_toyota.png", plate: "TN37CS2765", vehicle: "Toyota Innova" },
  { src: "/samples/expired_vw.png", plate: "MH01AV8866", vehicle: "VW Polo TDI" },
];

/* ── Props ── */
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

  const handleClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
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
    if (file) handleFile(file);
  };

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
    <section className="space-y-5">

      {/* ── Upload Card ── */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-blue-600">Upload Vehicle Photo</h2>
            <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WEBP — max 10 MB</p>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onClick={handleClick}
          onDragEnter={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDragOver={(e) => handleDrag(e, true)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
            ${dragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-200 bg-gray-50/50"}
            ${loading ? "opacity-60 pointer-events-none" : "hover:border-blue-300 hover:bg-blue-50/30"}
          `}
        >
          <div className="flex justify-center mb-3">
            <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gray-100">
              {loading ? (
                <svg className="w-5 h-5 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <PhotoIcon className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>

          {loading ? (
            <>
              <p className="text-sm font-medium text-blue-600">Analyzing image…</p>
              <p className="text-xs text-gray-400 mt-1">Running plate detection &amp; OCR</p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-700">Drag &amp; drop vehicle photo here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse from your device</p>
            </>
          )}

          {!loading && (
            <button
              type="button"
              className="mt-5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 mx-auto transition-colors"
            >
              <ArrowUpTrayIcon className="w-4 h-4" />
              Choose Photo
            </button>
          )}

          {fileName && !loading && (
            <p className="mt-3 text-xs text-emerald-600 font-medium">✓ Selected: {fileName}</p>
          )}

          {error && (
            <p className="mt-3 text-xs text-red-600 font-medium">✕ {error}</p>
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
        <div className="mt-5 pt-5 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <p className="text-xs font-semibold text-gray-600">Quick Test Samples</p>
            <span className="text-[11px] text-gray-400">— click to scan</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {SAMPLES.map((sample) => {
              const isActive = loadingSample === sample.src;
              return (
                <button
                  key={sample.src}
                  onClick={() => handleSampleClick(sample.src)}
                  disabled={loading}
                  className={`group relative rounded-xl overflow-hidden border transition-all duration-200
                    ${loading ? "opacity-40 cursor-not-allowed" : "hover:border-blue-400 hover:shadow-md cursor-pointer"}
                    ${isActive ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-200"}
                  `}
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-[72px] bg-gray-100">
                    <Image
                      src={sample.src}
                      alt={sample.vehicle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="120px"
                    />
                    {isActive && (
                      <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                        <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info — just plate + vehicle, no status badge */}
                  <div className="px-2 py-1.5 bg-white">
                    <p className="text-[11px] font-semibold text-gray-800 truncate">{sample.plate}</p>
                    <p className="text-[10px] text-gray-400 truncate">{sample.vehicle}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
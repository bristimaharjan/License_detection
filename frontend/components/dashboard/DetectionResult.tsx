"use client";

import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";
import type { PredictionResult } from "@/app/dashboard/page";

interface DetectionResultProps {
  result: PredictionResult | null;
  loading: boolean;
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export default function DetectionResult({ result, loading }: DetectionResultProps) {
  // Loading skeleton
  if (loading) {
    return (
      <Card shadow="sm" className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden">
        <CardBody className="p-6 gap-6 flex flex-col">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="h-5 w-36 mb-2" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-32 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
          <Skeleton className="h-8 w-full rounded" />
          <div className="flex justify-center">
            <Skeleton className="w-28 h-28 rounded-full" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!result) return null;

  const topDetection = result.detections[0];
  const confidence = topDetection ? Math.round(topDetection.confidence * 100 * 10) / 10 : 0;
  const plateText = result.plate_text || "—";
  const vehicle = result.vehicle;

  // Determine confidence label
  const confLabel = confidence >= 80 ? "High" : confidence >= 50 ? "Medium" : "Low";
  const confColor =
    confidence >= 80
      ? "bg-emerald-50 text-emerald-600"
      : confidence >= 50
      ? "bg-amber-50 text-amber-600"
      : "bg-red-50 text-red-600";
  const barColor =
    confidence >= 80 ? "bg-emerald-500" : confidence >= 50 ? "bg-amber-500" : "bg-red-500";
  const textColor =
    confidence >= 80 ? "text-emerald-500" : confidence >= 50 ? "text-amber-500" : "text-red-500";

  return (
    <Card
      shadow="sm"
      className="w-full max-w-2xl bg-white rounded-2xl overflow-hidden"
    >
      <CardBody className="p-6 gap-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-blue-600">
              Detection Result
            </p>
            <p className="text-xs text-gray-400">
              AI-powered plate recognition output
            </p>
          </div>
        </div>

        {/* Plate Display */}
        <div className="bg-[#0d1b2a] rounded-xl flex flex-col items-center justify-center py-7 gap-2">
          {/* License Plate */}
          <div className="bg-[#f5c518] rounded-xl px-8 py-3 flex items-center gap-3 shadow-lg">
            <div className="w-8 h-8 rounded-full bg-[#1a3a6b] flex items-center justify-center">
              <span className="text-white text-[9px] font-bold tracking-tight leading-none text-center">
                NP
              </span>
            </div>
            <span className="text-[#0d1b2a] text-3xl font-bold tracking-[0.2em] font-mono">
              {plateText || "—"}
            </span>
          </div>

          {/* Location Tag */}
          <div className="flex items-center gap-1 mt-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-gray-400 text-xs">
              Detected plate
            </span>
          </div>
        </div>

        {/* Vehicle & Color Info */}
        {vehicle ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Vehicle
              </p>
              <p className="text-base font-semibold text-gray-900 leading-tight">
                {vehicle.vehicle_year} {vehicle.vehicle_make}
              </p>
              <p className="text-sm text-gray-500">{vehicle.vehicle_model}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Color
              </p>
              <p className="text-base font-semibold text-gray-900 leading-tight">
                {vehicle.vehicle_color}
              </p>
              <p className="text-sm text-gray-500">Body color</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Vehicle
              </p>
              <p className="text-sm text-gray-500 italic">Not in database</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Color
              </p>
              <p className="text-sm text-gray-500 italic">Unknown</p>
            </div>
          </div>
        )}

        {/* Detection Confidence Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <span className="text-sm font-semibold text-gray-800">
                Detection Confidence
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${textColor}`}>
                {confidence}%
              </span>
              <Chip
                size="sm"
                className={`${confColor} border-0 text-xs font-semibold`}
              >
                {confLabel}
              </Chip>
            </div>
          </div>

          <Progress
            value={confidence}
            classNames={{
              base: "w-full",
              track: "bg-gray-100 h-3 rounded-full",
              indicator: `${barColor} rounded-full`,
            }}
            aria-label="Detection confidence"
          />

          <div className="flex justify-between text-xs text-gray-400 mt-0.5">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* OCR Accuracy Radial */}
        <div className="flex flex-col items-center gap-2 pt-2">
          {/* SVG Radial Progress */}
          <div className="relative w-28 h-28">
            <svg
              className="w-full h-full -rotate-90"
              viewBox="0 0 100 100"
            >
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
                strokeLinecap="round"
              />
              {/* Progress arc */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={confidence >= 80 ? "#10b981" : confidence >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - confidence / 100)}`}
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${textColor}`}>
                {Math.round(confidence)}%
              </span>
              <span className="text-xs text-gray-400">accuracy</span>
            </div>
          </div>

          <p className="text-sm text-gray-400">OCR Confidence Score</p>
        </div>
      </CardBody>
    </Card>
  );
}
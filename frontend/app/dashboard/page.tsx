"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import UploadCard from "@/components/dashboard/UploadCard";
import VehicleInfo from "@/components/dashboard/VehicleInfo";
import DetectionResult from "@/components/dashboard/DetectionResult";
import RecentScans from "@/components/dashboard/RecentScan";
import ActionButtons from "@/components/dashboard/ActionModals";
import ProtectedRoute, { useSession } from "@/components/auth/ProtectedRoute";

// ── Types ──────────────────────────────────────────────────────────────────────
export type VehicleRecord = {
  plate_number: string;
  owner_name: string;
  address: string;
  vehicle_year: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  reg_expiry: string;
  reg_status: string;
  insurance: string;
  insurance_provider: string;
  policy_number: string;
  fines: number;
  fine_amount: number;
  is_flagged: boolean;
};

export type PredictionResult = {
  filename: string;
  plate_text: string;
  prediction: string;
  confidence: number;
  detections: {
    class_name: string;
    confidence: number;
    bbox_xyxy: number[];
    bbox_normalized: number[];
  }[];
  image_size: { width: number; height: number };
  iou_score: number | null;
  is_correct: boolean | null;
  vehicle: VehicleRecord | null;
};

export type ScanHistoryEntry = PredictionResult & {
  scannedAt: string;
};

export default function DashboardPage() {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>([]);

  const handlePredict = async (file: File) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Server error: ${res.status}`);
      }

      const data: PredictionResult = await res.json();
      setResult(data);

      // Add to scan history
      setScanHistory((prev) => [
        {
          ...data,
          scannedAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const session = useSession();

  return (
    <ProtectedRoute>
      <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
        {/* Welcome bar */}
        {session && (
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-blue-900">
                Welcome, {session.name.split(" ").slice(-2).join(" ")}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{session.department}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                session.role === "admin"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-600"
              }`}>
                {session.role === "admin" ? "Admin" : "Officer"}
              </span>
              <span className="text-xs text-gray-400 font-mono">{session.badge}</span>
            </div>
          </div>
        )}
        <UploadCard onPredict={handlePredict} loading={loading} error={error} />

        {/* Flagged Alert Banner */}
        {result?.vehicle?.is_flagged && (
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl p-5 flex items-start gap-4 shadow-lg">
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-base">VEHICLE FLAGGED</p>
                <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Alert</span>
              </div>
              <p className="text-sm text-white/85 mt-1 leading-relaxed">
                Plate <strong>{result.vehicle.plate_number}</strong> is flagged in the national registry.
                Registered to <strong>{result.vehicle.owner_name}</strong>. Exercise caution and follow protocol.
              </p>
            </div>
          </div>
        )}

        {(result || loading) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <VehicleInfo result={result} loading={loading} />
            <DetectionResult result={result} loading={loading} />
          </div>
        )}

        {/* Action Buttons — Issue Fine & Flag Vehicle */}
        {result?.vehicle && (
          <ActionButtons vehicle={result.vehicle} />
        )}

        <RecentScans scans={scanHistory} />
      </main>
    </ProtectedRoute>
  );
}
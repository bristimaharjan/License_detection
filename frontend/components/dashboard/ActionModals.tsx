"use client";

import { useState } from "react";
import type { VehicleRecord } from "@/app/dashboard/page";

// ── Fine Reasons ───────────────────────────────────────────────────
const FINE_REASONS = [
  "Speeding",
  "Running a red light",
  "Illegal parking",
  "Expired registration",
  "No insurance",
  "Reckless driving",
  "Broken tail light",
  "Illegal tint",
  "Other",
];

const FLAG_REASONS = [
  "Reported stolen",
  "Involved in hit-and-run",
  "Suspected fraud",
  "Outstanding warrants",
  "Failed emissions test",
  "Tampered plates",
  "Other",
];

// ── Modal Backdrop ─────────────────────────────────────────────────
function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden animate-in" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}

// ── Vehicle Summary Row ────────────────────────────────────────────
function VehicleSummary({ v }: { v: VehicleRecord }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
      <div><span className="text-gray-400">Plate</span><p className="font-bold text-gray-900">{v.plate_number}</p></div>
      <div><span className="text-gray-400">Owner</span><p className="font-semibold text-gray-900">{v.owner_name}</p></div>
      <div><span className="text-gray-400">Vehicle</span><p className="text-gray-700">{v.vehicle_year} {v.vehicle_make} {v.vehicle_model}</p></div>
      <div><span className="text-gray-400">Color</span><p className="text-gray-700">{v.vehicle_color}</p></div>
    </div>
  );
}

// ── Toast Notification ─────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">✕</button>
    </div>
  );
}

// ── Issue Fine Modal ───────────────────────────────────────────────
function IssueFineModal({ vehicle, onClose }: { vehicle: VehicleRecord; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("500");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/issue-fine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate_number: vehicle.plate_number,
          owner_name: vehicle.owner_name,
          vehicle_year: vehicle.vehicle_year,
          vehicle_make: vehicle.vehicle_make,
          vehicle_model: vehicle.vehicle_model,
          reason, amount, notes,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to issue fine");
      }
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Backdrop onClose={onClose}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Fine Issued Successfully</h3>
          <p className="text-sm text-gray-500 mb-1">Fine of <strong>NPR {amount}</strong> issued to <strong>{vehicle.owner_name}</strong></p>
          <p className="text-sm text-gray-500 mb-6">Notification sent to the registered email address.</p>
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Close</button>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Issue Fine</h3>
            <p className="text-xs text-gray-400">Traffic violation citation</p>
          </div>
        </div>

        <VehicleSummary v={vehicle} />

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Fine *</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300">
              <option value="">Select reason...</option>
              {FINE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fine Amount (NPR) *</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="100" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Optional details about the violation..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none" />
          </div>
          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">⚠ {submitError}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!reason || submitting} className="flex-1 px-4 py-2.5 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {submitting ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</> : "Issue Fine"}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ── Flag Vehicle Modal ─────────────────────────────────────────────
function FlagVehicleModal({ vehicle, onClose }: { vehicle: VehicleRecord; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/api/flag-vehicle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plate_number: vehicle.plate_number,
          owner_name: vehicle.owner_name,
          vehicle_year: vehicle.vehicle_year,
          vehicle_make: vehicle.vehicle_make,
          vehicle_model: vehicle.vehicle_model,
          reason, notes,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to flag vehicle");
      }
      setDone(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <Backdrop onClose={onClose}>
        <div className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Vehicle Flagged</h3>
          <p className="text-sm text-gray-500 mb-1"><strong>{vehicle.plate_number}</strong> has been flagged in the system.</p>
          <p className="text-sm text-gray-500 mb-1">Reason: <strong>{reason}</strong></p>
          <p className="text-sm text-gray-400 mb-6">All patrol units have been notified.</p>
          <button onClick={onClose} className="px-6 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">Close</button>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Flag Vehicle</h3>
            <p className="text-xs text-gray-400">Mark vehicle in system alert database</p>
          </div>
        </div>

        <VehicleSummary v={vehicle} />

        {vehicle.is_flagged && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-center gap-2">
            <span>⚠</span> This vehicle is already flagged in the system.
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason for Flagging *</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300">
              <option value="">Select reason...</option>
              {FLAG_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Details / Notes *</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Provide details about the incident or reason for flagging..." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 resize-none" />
          </div>
          {submitError && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">⚠ {submitError}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!reason || submitting} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {submitting ? <><svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing...</> : "Flag Vehicle"}
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

// ── Action Buttons Bar ─────────────────────────────────────────────
export default function ActionButtons({ vehicle }: { vehicle: VehicleRecord | null }) {
  const [showFine, setShowFine] = useState(false);
  const [showFlag, setShowFlag] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  if (!vehicle) return null;

  return (
    <>
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => setShowFine(true)} className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          Issue Fine
        </button>
        <button onClick={() => setShowFlag(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>
          Flag Vehicle
        </button>
      </div>

      {showFine && <IssueFineModal vehicle={vehicle} onClose={() => { setShowFine(false); setToast({ message: "Fine issued & notification sent", type: "success" }); setTimeout(() => setToast(null), 4000); }} />}
      {showFlag && <FlagVehicleModal vehicle={vehicle} onClose={() => { setShowFlag(false); setToast({ message: "Vehicle flagged in system", type: "success" }); setTimeout(() => setToast(null), 4000); }} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}

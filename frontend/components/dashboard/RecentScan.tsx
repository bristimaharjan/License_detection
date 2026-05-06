"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import type { ScanHistoryEntry } from "@/app/dashboard/page";

// ── Types ──────────────────────────────────────────────────────────────────────
type Status = "Clear" | "Flagged" | "Expired" | "Unregistered" | "Unknown";

interface ProcessedScan {
  id: string;
  plate: string;
  year: number;
  make: string;
  model: string;
  color: string;
  status: Status;
  fines: number | null;
  confidence: number;
  scannedTime: string;
  scannedDate: string;
  owner: string;
  insurance: string;
}

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; icon: string }
> = {
  Flagged: {
    label: "Flagged",
    color: "bg-red-50 text-red-600 border border-red-200",
    icon: "⚠",
  },
  Clear: {
    label: "Clear",
    color: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    icon: "✓",
  },
  Expired: {
    label: "Expired",
    color: "bg-amber-50 text-amber-600 border border-amber-200",
    icon: "⏱",
  },
  Unregistered: {
    label: "Unregistered",
    color: "bg-gray-100 text-gray-600 border border-gray-200",
    icon: "✕",
  },
  Unknown: {
    label: "Unknown",
    color: "bg-gray-100 text-gray-500 border border-gray-200",
    icon: "?",
  },
};

// ── Filter tabs ────────────────────────────────────────────────────────────────
type FilterKey = "All" | Status;

// ── Confidence Bar ─────────────────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-sm text-gray-700">{value}%</span>
    </div>
  );
}

// ── Sort icon ──────────────────────────────────────────────────────────────────
function SortIcon({ active }: { active?: boolean }) {
  return (
    <span className={`text-xs ml-1 ${active ? "text-gray-800" : "text-gray-400"}`}>
      ⇅
    </span>
  );
}

// ── Helper: derive status from vehicle record ──────────────────────────────────
function deriveStatus(entry: ScanHistoryEntry): Status {
  if (!entry.vehicle) return "Unknown";
  if (entry.vehicle.is_flagged) return "Flagged";
  if (entry.vehicle.reg_status === "Expired") return "Expired";
  return "Clear";
}

// ── Helper: convert ScanHistoryEntry to ProcessedScan ──────────────────────────
function processEntry(entry: ScanHistoryEntry, index: number): ProcessedScan {
  const ts = new Date(entry.scannedAt);
  const vehicle = entry.vehicle;
  return {
    id: `scan-${index}-${ts.getTime()}`,
    plate: entry.plate_text || vehicle?.plate_number || "—",
    year: vehicle?.vehicle_year || 0,
    make: vehicle?.vehicle_make || "—",
    model: vehicle?.vehicle_model || "",
    color: vehicle?.vehicle_color || "—",
    status: deriveStatus(entry),
    fines: vehicle?.fines ?? null,
    confidence: Math.round((entry.confidence || 0) * 100),
    scannedTime: ts.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    scannedDate: ts.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" }),
    owner: vehicle?.owner_name || "—",
    insurance: vehicle?.insurance || "—",
  };
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RecentScans({ scans }: { scans: ScanHistoryEntry[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const processed = scans.map((s, i) => processEntry(s, i));

  const counts: Record<FilterKey, number> = {
    All: processed.length,
    Clear: processed.filter((s) => s.status === "Clear").length,
    Flagged: processed.filter((s) => s.status === "Flagged").length,
    Expired: processed.filter((s) => s.status === "Expired").length,
    Unregistered: processed.filter((s) => s.status === "Unregistered").length,
    Unknown: processed.filter((s) => s.status === "Unknown").length,
  };

  const filtered = processed.filter((s) => {
    const matchesFilter = filter === "All" || s.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.plate.toLowerCase().includes(q) ||
      s.make.toLowerCase().includes(q) ||
      s.model.toLowerCase().includes(q) ||
      s.owner.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const allSelected =
    filtered.length > 0 && filtered.every((s) => selected.has(s.id));

  function toggleAll() {
    if (allSelected) {
      const next = new Set(selected);
      filtered.forEach((s) => next.delete(s.id));
      setSelected(next);
    } else {
      const next = new Set(selected);
      filtered.forEach((s) => next.add(s.id));
      setSelected(next);
    }
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  const filters: FilterKey[] = ["All", "Clear", "Flagged", "Expired", "Unregistered", "Unknown"];

  return (
    <Card shadow="sm" className="w-full bg-white rounded-2xl overflow-hidden">
      <CardBody className="p-6 flex flex-col gap-5">

        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">Recent Scans</p>
              <p className="text-xs text-gray-400">
                {counts.All} {counts.All === 1 ? "scan" : "scans"} this session
              </p>
            </div>
          </div>
        </div>

        {/* ── Search + Filter Row ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search plate, owner, vehicle..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => {
              // Hide filter tabs with 0 count (except All)
              if (f !== "All" && counts[f] === 0) return null;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    filter === f
                      ? "bg-[#1a2744] text-white"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {f === "All" ? `All (${counts.All})` : `${f} (${counts[f]})`}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 w-8">
                  <Checkbox
                    isSelected={allSelected}
                    onChange={toggleAll}
                    size="sm"
                    classNames={{ base: "p-0" }}
                  />
                </th>
                {[
                  { label: "Plate Number", sortable: true },
                  { label: "Vehicle", sortable: true },
                  { label: "Status", sortable: true },
                  { label: "Fines", sortable: true },
                  { label: "Confidence", sortable: true },
                  { label: "Scanned", sortable: true, active: true },
                  { label: "Owner", sortable: false },
                  { label: "Insurance", sortable: false },
                ].map(({ label, sortable, active }) => (
                  <th
                    key={label}
                    className="py-3 pr-6 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {label}
                    {sortable && <SortIcon active={active} />}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.map((scan) => {
                const cfg = STATUS_CONFIG[scan.status];
                return (
                  <tr
                    key={scan.id}
                    className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="py-4 pr-4">
                      <Checkbox
                        isSelected={selected.has(scan.id)}
                        onChange={() => toggleRow(scan.id)}
                        size="sm"
                        classNames={{ base: "p-0" }}
                      />
                    </td>

                    {/* Plate */}
                    <td className="py-4 pr-6 font-semibold text-gray-900 whitespace-nowrap">
                      {scan.plate}
                    </td>

                    {/* Vehicle */}
                    <td className="py-4 pr-6">
                      <p className="text-gray-900">
                        {scan.year > 0 ? `${scan.year} ` : ""}{scan.make} {scan.model}
                      </p>
                      <p className="text-gray-400 text-xs">{scan.color}</p>
                    </td>

                    {/* Status */}
                    <td className="py-4 pr-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                        <span>{cfg.icon}</span>
                        {cfg.label}
                      </span>
                    </td>

                    {/* Fines */}
                    <td className="py-4 pr-6">
                      {scan.fines !== null && scan.fines > 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-red-300 text-red-500 text-xs font-semibold">
                          {scan.fines}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Confidence */}
                    <td className="py-4 pr-6">
                      <ConfidenceBar value={scan.confidence} />
                    </td>

                    {/* Scanned */}
                    <td className="py-4 pr-6 whitespace-nowrap">
                      <p className="text-gray-900">{scan.scannedTime}</p>
                      <p className="text-gray-400 text-xs">{scan.scannedDate}</p>
                    </td>

                    {/* Owner */}
                    <td className="py-4 pr-6">
                      <p className="text-gray-900 truncate max-w-[160px]">{scan.owner}</p>
                    </td>

                    {/* Insurance */}
                    <td className="py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        scan.insurance === "Yes"
                          ? "bg-green-100 text-green-600"
                          : scan.insurance === "No"
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {scan.insurance === "Yes" ? "Insured" : scan.insurance === "No" ? "Not Insured" : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400 text-sm">
                    {processed.length === 0
                      ? "No scans yet. Upload an image to get started."
                      : "No scans match your search."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
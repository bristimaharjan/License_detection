"use client";

import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Checkbox } from "@heroui/checkbox";

// ── Types ──────────────────────────────────────────────────────────────────────
type Status = "Clear" | "Flagged" | "Expired" | "Unregistered";

interface Scan {
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
  officer: string;
  location: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const SCANS: Scan[] = [
  {
    id: "1",
    plate: "CXK-4821",
    year: 2019,
    make: "Toyota",
    model: "Camry",
    color: "Silver",
    status: "Flagged",
    fines: 3,
    confidence: 95,
    scannedTime: "5:51 PM",
    scannedDate: "05/05/2026",
    officer: "Ofc. M. Reyes",
    location: "Hwy 101 N — Checkpoin...",
  },
  {
    id: "2",
    plate: "8HTK923",
    year: 2021,
    make: "Honda",
    model: "Civic",
    color: "White",
    status: "Clear",
    fines: null,
    confidence: 98,
    scannedTime: "5:44 PM",
    scannedDate: "05/05/2026",
    officer: "Ofc. M. Reyes",
    location: "Elm St — Intersection 4",
  },
  {
    id: "3",
    plate: "JXP-1144",
    year: 2016,
    make: "Ford",
    model: "F-150",
    color: "Black",
    status: "Expired",
    fines: 1,
    confidence: 91,
    scannedTime: "5:38 PM",
    scannedDate: "05/05/2026",
    officer: "Ofc. T. Nakamura",
    location: "Market Blvd — Zone C",
  },
  {
    id: "4",
    plate: "LMN-5523",
    year: 2018,
    make: "Chevrolet",
    model: "Malibu",
    color: "Blue",
    status: "Clear",
    fines: null,
    confidence: 96,
    scannedTime: "5:30 PM",
    scannedDate: "05/05/2026",
    officer: "Ofc. T. Nakamura",
    location: "Pine Ave — Zone A",
  },
  {
    id: "5",
    plate: "RTZ-8801",
    year: 2020,
    make: "Nissan",
    model: "Altima",
    color: "Red",
    status: "Unregistered",
    fines: null,
    confidence: 88,
    scannedTime: "5:22 PM",
    scannedDate: "05/05/2026",
    officer: "Ofc. M. Reyes",
    location: "Oak Rd — Checkpoint 2",
  },
];

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
};

// ── Filter tabs ────────────────────────────────────────────────────────────────
type FilterKey = "All" | Status;

// ── Confidence Bar ─────────────────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full"
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

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RecentScans() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts: Record<FilterKey, number> = {
    All: SCANS.length,
    Clear: SCANS.filter((s) => s.status === "Clear").length,
    Flagged: SCANS.filter((s) => s.status === "Flagged").length,
    Expired: SCANS.filter((s) => s.status === "Expired").length,
    Unregistered: SCANS.filter((s) => s.status === "Unregistered").length,
  };

  const filtered = SCANS.filter((s) => {
    const matchesFilter = filter === "All" || s.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      s.plate.toLowerCase().includes(q) ||
      s.make.toLowerCase().includes(q) ||
      s.model.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.officer.toLowerCase().includes(q);
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

  const filters: FilterKey[] = ["All", "Clear", "Flagged", "Expired", "Unregistered"];

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
                {counts.All} scans today · Last updated 17:53
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
            </button>
            {/* Download */}
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
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
              placeholder="Search plate, owner, location..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            />
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
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
            ))}
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
                  { label: "Officer / Location", sortable: false },
                  { label: "Act.", sortable: false },
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
                        {scan.year} {scan.make} {scan.model}
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
                      {scan.fines !== null ? (
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

                    {/* Officer / Location */}
                    <td className="py-4 pr-6">
                      <p className="text-gray-900">{scan.officer}</p>
                      <p className="text-gray-400 text-xs truncate max-w-[160px]">
                        {scan.location}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="py-4">
                      <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400 text-sm">
                    No scans match your search.
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
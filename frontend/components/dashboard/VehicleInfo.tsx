"use client";

import {
  IdentificationIcon,
  TruckIcon,
  UserIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import type { PredictionResult } from "@/app/dashboard/page";

interface VehicleInfoProps {
  result: PredictionResult | null;
  loading: boolean;
}

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
      {children}
    </div>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export default function VehicleInfo({ result, loading }: VehicleInfoProps) {
  const vehicle = result?.vehicle;
  const plateText = result?.plate_text || result?.vehicle?.plate_number || "—";

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-7 w-24" />
        </div>
        <div className="mt-5 space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 border-b border-gray-100 pb-4">
              <Skeleton className="w-9 h-9 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-3 w-28 mb-2" />
                <Skeleton className="h-4 w-44" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // No data yet
  if (!result) {
    return null;
  }

  // Not found in database
  if (!vehicle) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-blue-600">
              Vehicle Information
            </h3>
            <p className="text-sm text-gray-500">
              Registry record as of today
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-gray-900">{plateText}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center text-center py-6">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="w-7 h-7 text-amber-500" />
          </div>
          <p className="text-gray-900 font-medium">Vehicle Not Found in Database</p>
          <p className="text-sm text-gray-500 mt-1 max-w-xs">
            The detected plate &ldquo;{plateText}&rdquo; was not found in the vehicle registry.
            This may be an unregistered or foreign vehicle.
          </p>
        </div>
      </div>
    );
  }

  const isExpired = vehicle.reg_status === "Expired";
  const hasInsurance = vehicle.insurance === "Yes";
  const hasFines = vehicle.fines > 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-blue-600">
            Vehicle Information
          </h3>
          <p className="text-sm text-gray-500">
            Registry record as of today
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-semibold text-gray-900">{vehicle.plate_number}</p>
        </div>
      </div>

      <div className="mt-5 space-y-5">

        {/* Registration */}
        <div className="flex gap-3 border-b border-gray-100 pb-4">
          <IconWrap>
            <IdentificationIcon className="w-5 h-5 text-gray-500" />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Registration Number
            </p>
            <p className="text-sm font-medium text-gray-900">
              {vehicle.plate_number}
            </p>
          </div>
        </div>

        {/* Vehicle */}
        <div className="flex gap-3 border-b border-gray-100 pb-4">
          <IconWrap>
            <TruckIcon className="w-5 h-5 text-blue-500" />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Vehicle
            </p>
            <p className="text-sm font-medium text-gray-900">
              {vehicle.vehicle_year} {vehicle.vehicle_make} {vehicle.vehicle_model}
            </p>
            <p className="text-xs text-gray-500">
              {vehicle.vehicle_color}
            </p>
          </div>
        </div>

        {/* Owner */}
        <div className="flex gap-3 border-b border-gray-100 pb-4">
          <IconWrap>
            <UserIcon className="w-5 h-5 text-yellow-500" />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Registered Owner
            </p>
            <p className="text-sm font-medium text-gray-900">
              {vehicle.owner_name}
            </p>
            <p className="text-xs text-gray-500">
              {vehicle.address}
            </p>
          </div>
        </div>

        {/* Expiry */}
        <div className="flex gap-3 border-b border-gray-100 pb-4">
          <IconWrap>
            <CalendarIcon className={`w-5 h-5 ${isExpired ? "text-red-500" : "text-green-500"}`} />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Registration Expiry
            </p>

            <div className="flex items-center gap-2">
              <p className={`text-sm font-medium ${isExpired ? "text-red-600" : "text-gray-900"}`}>
                {new Date(vehicle.reg_expiry).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isExpired
                    ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {vehicle.reg_status}
              </span>
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div className="flex gap-3 border-b border-gray-100 pb-4">
          <IconWrap>
            <ShieldCheckIcon className={`w-5 h-5 ${hasInsurance ? "text-green-500" : "text-red-500"}`} />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Insurance Status
            </p>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  hasInsurance
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {hasInsurance ? "Verified" : "Not Insured"}
              </span>
              {hasInsurance && vehicle.insurance_provider && (
                <p className="text-sm text-gray-900">
                  {vehicle.insurance_provider}
                  {vehicle.policy_number ? ` — ${vehicle.policy_number}` : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fines */}
        <div className="flex gap-3">
          <IconWrap>
            <CurrencyDollarIcon className={`w-5 h-5 ${hasFines ? "text-red-500" : "text-green-500"}`} />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Outstanding Fines
            </p>

            <div className="flex items-center gap-2">
              {hasFines ? (
                <>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    {vehicle.fines} {vehicle.fines === 1 ? "fine" : "fines"}
                  </span>
                  <p className="text-sm font-medium text-gray-900">
                    NPR {vehicle.fine_amount.toLocaleString()} total
                  </p>
                </>
              ) : (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  No outstanding fines
                </span>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
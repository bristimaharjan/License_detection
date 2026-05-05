"use client";

import {
  IdentificationIcon,
  TruckIcon,
  UserIcon,
  CalendarIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
      {children}
    </div>
  );
}

export default function VehicleInfo() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Vehicle Information
          </h3>
          <p className="text-sm text-gray-500">
            Registry record as of today
          </p>
        </div>

        <div className="text-right">
          <p className="text-xl font-semibold text-gray-900">CXK-4821</p>
          <p className="text-xs text-gray-500">California</p>
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
              CXK-4821
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
              2019 Toyota Camry
            </p>
            <p className="text-xs text-gray-500">
              Sedan — 4-Door · Silver
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
              Nathaniel E. Vargas
            </p>
            <p className="text-xs text-gray-500">
              2847 Clearwater Blvd, Sacramento, CA
            </p>
          </div>
        </div>

        {/* Expiry */}
        <div className="flex gap-3 border-b border-gray-100 pb-4">
          <IconWrap>
            <CalendarIcon className="w-5 h-5 text-red-500" />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Registration Expiry
            </p>

            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-red-600">
                11/15/2024
              </p>
              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                Expired
              </span>
            </div>
          </div>
        </div>

        {/* Insurance */}
        <div className="flex gap-3 border-b border-gray-100 pb-4">
          <IconWrap>
            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Insurance Status
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                Verified
              </span>
              <p className="text-sm text-gray-900">
                State Farm — Policy #SF-20948811
              </p>
            </div>
          </div>
        </div>

        {/* Fines */}
        <div className="flex gap-3">
          <IconWrap>
            <CurrencyDollarIcon className="w-5 h-5 text-red-500" />
          </IconWrap>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Outstanding Fines
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                3 fines
              </span>
              <p className="text-sm font-medium text-gray-900">
                $485 total
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
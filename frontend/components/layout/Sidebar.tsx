"use client";

import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { logout } from "@/lib/auth";
import { useSession } from "@/components/auth/ProtectedRoute";

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const session = useSession();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 shadow-lg z-50 bg-white ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <h1 className="text-lg font-bold text-blue-600">
            PlateDetect
          </h1>
        )}

        <button onClick={() => setCollapsed(!collapsed)}>
          <Bars3Icon className="w-6 text-blue-600" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-2 space-y-2">
        <SidebarItem
          icon={<HomeIcon className="w-5" />}
          label="Scan & Detect"
          collapsed={collapsed}
        />

        <SidebarItem
          icon={<BellIcon className="w-5" />}
          label="Recent Scans"
          collapsed={collapsed}
        />
      </nav>

      {/* User info + Logout */}
      <div className="p-3 mt-auto space-y-2">
        {/* User badge */}
        {session && !collapsed && (
          <div className="px-3 py-2.5 rounded-lg bg-blue-50 mb-2">
            <p className="text-xs font-semibold text-blue-800 truncate">{session.name}</p>
            <p className="text-[10px] text-blue-500 truncate">{session.badge} · {session.role === "admin" ? "Admin" : "Officer"}</p>
          </div>
        )}

        <button onClick={handleLogout} className="w-full">
          <SidebarItem
            icon={<ArrowLeftOnRectangleIcon className="w-5" />}
            label="Logout"
            collapsed={collapsed}
          />
        </button>
      </div>
    </aside>
  );
}

/* ---------------- Sidebar Item ---------------- */

function SidebarItem({
  icon,
  label,
  collapsed,
}: {
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition text-blue-600 hover:bg-blue-50">
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </div>
  );
}
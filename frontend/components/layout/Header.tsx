"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useSession } from "@/components/auth/ProtectedRoute";
import { 
  ArrowLeftOnRectangleIcon, 
  UserCircleIcon 
} from "@heroicons/react/24/outline";

export default function Header() {
  const router = useRouter();
  const session = useSession();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1.707 1.707 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-blue-900 tracking-tight">PlateDetect</span>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {session && (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{session.name}</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                  {session.role === "admin" ? "Admin User" : "Officer"}
                </p>
              </div>
              
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm border-2 border-white shadow-sm">
                {session.name.charAt(0)}
              </div>
            </div>
          )}

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
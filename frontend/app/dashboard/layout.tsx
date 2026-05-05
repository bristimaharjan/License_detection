"use client";

import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <main
        className={`transition-all duration-300 min-h-screen bg-gray-100 p-6 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
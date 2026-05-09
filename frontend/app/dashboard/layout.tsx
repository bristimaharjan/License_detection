"use client";

import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      
      <div className="flex-1 transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
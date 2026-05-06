"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isLoggedIn } from "@/lib/auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) router.replace("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Nav ── */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-[1200px] mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-900 tracking-tight">PlateDetect</span>
        </div>
        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Login to System
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="px-6 pt-12 pb-4 max-w-[1200px] mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">Secure Government Platform</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Traffic Police
            <br />
            <span className="text-blue-600">Management System</span>
          </h1>

          <p className="mt-5 text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
            Secure enforcement platform for real-time license plate monitoring,
            violation tracking, and vehicle registry management.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="group px-7 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center gap-2"
            >
              Login to System
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Product Mockup ── */}
        <div className="mt-14 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-2xl shadow-gray-300/40">
            <Image
              src="/dashboard-preview.png"
              alt="PlateDetect Dashboard Preview"
              width={1200}
              height={700}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="px-6 py-16 max-w-[1200px] mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Built for Law Enforcement</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">Everything officers need in a single, integrated platform</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              ),
              title: "AI Plate Detection",
              desc: "YOLOv8 deep learning model detects and reads license plates with 90%+ accuracy in real-time.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              ),
              title: "Vehicle Registry",
              desc: "Instant lookup of owner information, insurance status, registration validity, and outstanding fines.",
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" y1="22" x2="4" y2="15" />
                </svg>
              ),
              title: "Flag & Fine",
              desc: "Issue traffic fines and flag suspicious vehicles with automated email notifications to owners.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <p className="text-base font-semibold text-gray-900">{f.title}</p>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it Works ── */}
      <section className="px-6 py-16 bg-white border-y border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">How It Works</h2>
            <p className="text-sm text-gray-500 mt-2">Four simple steps from image capture to enforcement action</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Upload Image",
                desc: "Officer uploads a vehicle photo or uses the integrated camera feed.",
                color: "bg-blue-600",
              },
              {
                step: "02",
                title: "AI Detection",
                desc: "YOLOv8 model detects the license plate region and extracts text via OCR.",
                color: "bg-indigo-600",
              },
              {
                step: "03",
                title: "Database Lookup",
                desc: "Plate number is matched against the national vehicle registry in milliseconds.",
                color: "bg-violet-600",
              },
              {
                step: "04",
                title: "Take Action",
                desc: "Officer reviews results and can issue fines, flag vehicles, or clear the scan.",
                color: "bg-purple-600",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold mb-4`}>
                  {item.step}
                </div>
                <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Demo Credentials ── */}
      <section className="px-6 py-12 max-w-[1200px] mx-auto w-full text-center">
        <div className="inline-flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-white border border-gray-200 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Demo Credentials</p>
          <p className="text-sm text-gray-600">
            <span className="font-mono text-gray-800">bristi@police.gov.np</span>
            <span className="mx-2 text-gray-300">/</span>
            <span className="font-mono text-gray-800">admin123</span>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-100 mt-auto">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <span className="text-sm font-semibold text-gray-700">PlateDetect</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <span>Nepal Traffic Police Department</span>
              <span className="hidden sm:inline">·</span>
              <span>License Plate Recognition System</span>
              <span className="hidden sm:inline">·</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
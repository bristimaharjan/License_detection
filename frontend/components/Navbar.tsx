"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
      {/* Logo */}
      <div className="text-xl font-semibold tracking-tight">
        PlateAI
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-gray-600 hover:text-black transition">
          Home
        </Link>

        <Link
          href="/get-started"
          className="px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}
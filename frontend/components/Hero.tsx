"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
    <div
  className="absolute inset-0 -z-10"
  style={{
    background:
      "radial-gradient(circle at 10% 10%, rgba(202,85,41,0.12), transparent 40%), radial-gradient(circle at 90% 80%, rgba(47,126,132,0.12), transparent 40%)",
  }}
/>

      {/* Floating blurred shapes */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-10 right-10 w-52 h-52 bg-blue-200 rounded-full blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
          Smarter License Plate Detection.{" "}
        <span
  className="text-transparent bg-clip-text"
  style={{
    backgroundImage: "linear-gradient(120deg, #ca5529, #2f7e84)",
  }}
>
            Built for Speed.
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          AI-powered system for real-time license plate recognition with high
          accuracy, seamless integration, and lightning-fast performance.
        </p>

        {/* CTA */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/get-started"
            className="button"
          >
            Get Started →
          </Link>
        </div>

        <p className="mt-3 text-sm text-gray-400">
          No setup required • Ready in seconds
        </p>

        {/* Mock UI Cards */}
        <div className="mt-16 flex justify-center relative">
          <div className="bg-white shadow-xl rounded-xl p-4 w-72 border">
            <div className="text-sm text-gray-500 mb-2">
              Detection Preview
            </div>
            <div className="h-40 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              Plate: MH12AB1234
            </div>
          </div>

          <div className="absolute -bottom-6 -right-10 bg-white shadow-lg rounded-xl p-3 w-48 border">
            <p className="text-xs text-gray-500">Confidence</p>
            <p className="text-lg font-semibold text-green-600">98.7%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
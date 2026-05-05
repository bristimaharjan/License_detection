import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center">
      <Link
        href="/dashboard"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
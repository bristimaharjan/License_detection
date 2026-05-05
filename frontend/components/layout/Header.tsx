export default function Header() {
  return (
    <header className="bg-slate-100 px-6 py-4">
      <div className="flex flex-col">
        <h2 className="font-bold text-2xl text-blue-600">
          Scan & Detect
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload an image to detect and analyze license plate details
        </p>
      </div>
    </header>
  );
}
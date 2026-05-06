export default function Header() {
  return (
    <header className="bg-slate-100 px-6 py-4">
      <div className="flex flex-col">
       <h1 className="text-4xl font-bold tracking-tight text-blue-900">Scan &amp; Detect</h1>
        <p className="text-sm text-gray-500 mt-0.5">Upload an image to detect and analyze license plate details</p>
      </div>
    </header>
  );
}
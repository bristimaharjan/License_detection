"use client";

import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { PhotoIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

export default function UploadCard() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 w-full">
      <h3 className="text-lg font-semibold text-[#2563EB]">
        Upload Vehicle Photo
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        JPEG, PNG, WEBP — max 10 MB
      </p>

      <div
        onClick={handleClick}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center bg-white cursor-pointer transition
          ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
            <PhotoIcon className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        <p className="text-gray-700 font-medium">
          Drag & drop vehicle photo here
        </p>
        <p className="text-sm text-gray-500 mt-1">
          or click to browse from your device
        </p>

        <button
          type="button"
          className="mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center gap-2 mx-auto"
        >
          <ArrowUpTrayIcon className="w-4 h-4" />
          Choose Photo
        </button>

        {fileName && (
          <p className="mt-4 text-sm text-green-600">
            Selected: {fileName}
          </p>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
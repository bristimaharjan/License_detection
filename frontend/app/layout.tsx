import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "License Plate Detection Inference",
  description: "Upload an image and run backend YOLO detection CNN model to detect license plates.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

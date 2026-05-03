import type { Metadata } from "next";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import StatsStrip from "@/components/home/StatsStrip";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorks from "@/components/home/HowItWorks";
import CtaBanner from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "PlateVision — YOLO License Plate Detection",
  description:
    "Upload any vehicle image and run backend YOLOv8 inference. Instantly detect license plates with confidence scores and model metrics.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <StatsStrip />
        <FeaturesSection />
        <HowItWorks />
        <CtaBanner />
      </main>
      <footer>
        Built with YOLOv8 · PlateVision Detection System · 2025
      </footer>
    </>
  );
}

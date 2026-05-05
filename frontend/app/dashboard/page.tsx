import Header from "@/components/layout/Header";
import UploadCard from "@/components/dashboard/UploadCard";
import VehicleInfo from "@/components/dashboard/VehicleInfo";
import DetectionResult from "@/components/dashboard/DetectionResult";
import RecentScans from "@/components/dashboard/RecentScan";

export default function DashboardPage() {
  return (
    <>
      <Header />

      <div className="p-6 space-y-6">
        <UploadCard />

        <div className="grid grid-cols-2 gap-6">
          <VehicleInfo />
          <DetectionResult />
        </div>

        <RecentScans />
      </div>
    </>
  );
}
import { Suspense } from "react";
import AttendanceEntryPageClient from "@/components/AttendanceEntryPageClient";

export default function AttendanceEntryPage() {
  return (
    <Suspense
      fallback={<div className="text-white mt-10 text-center">Loading...</div>}
    >
      <AttendanceEntryPageClient />
    </Suspense>
  );
}
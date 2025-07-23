import ViewResultPageClient from "@/components/ViewResultPageClient";
import { Suspense } from "react";


export default function MarksEntryPage() {
  return (
    <Suspense
      fallback={<div className="text-white mt-10 text-center">Loading...</div>}
    >
      <ViewResultPageClient />
    </Suspense>
  );
}
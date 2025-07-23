import MarksEntryPageClient from "@/components/MarksEntryPageClient";
import { Suspense } from "react";


export default function MarksEntryPage() {
  return (
    <Suspense
      fallback={<div className="text-white mt-10 text-center">Loading...</div>}
    >
      <MarksEntryPageClient />
    </Suspense>
  );
}
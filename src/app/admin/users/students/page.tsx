"use client";

import React, { useState } from "react";
import DepartmentSection from "@/components/students/DepartmentSection";

type Batches = {
  [departmentName: string]: string[];
};

export default function Students() {
  const [batches, setBatches] = useState<Batches>({
    "COMPUTER SCIENCE": ["Sem 1", "Sem 3", "Sem 5", "Sem 7"],
    "ELECTRONICS & COMMUNICATION": ["Sem 1", "Sem 3", "Sem 5"],
    "FIRST YEAR (ALL)": ["Sem 1"],
  });

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm rounded-lg p-2 border-white/20 border-[1px]  z-10 lg:h-[90vh] w-full text-zinc-200 flex flex-col">
      
      <header className="flex-shrink-0 border-b-4 border-white/30 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-3xl font-bold text-white">Manage Students</h1>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {Object.keys(batches)
            .sort()
            .map((dept) => (
              <DepartmentSection
                key={dept}
                title={dept}
                batches={batches}
                setBatches={setBatches}
              />
            ))}
        </div>
      </main>
    </div>
  );
}

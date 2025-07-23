
"use client";

import React, { useState } from "react";
import { ChevronDown, Download } from "lucide-react";

export default function SyllabusPage() {
  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  const branches = ["CSE", "ECE"];
  const currentSem = 5;
  const currentBranch = "CSE";

  const [selectedSem, setSelectedSem] = useState<number>(currentSem);
  const [selectedBranch, setSelectedBranch] = useState<string>(currentBranch);

  const getPdfPath = () =>
    `/syllabus/${selectedBranch.toLowerCase()}/sem${selectedSem}${selectedBranch.toLowerCase()}.pdf`;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = getPdfPath();
    link.download = `sem${selectedSem}${selectedBranch.toLowerCase()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-4">Syllabus Viewer</h1>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Semester Dropdown */}
        <div className="relative">
          <select
            value={selectedSem}
            onChange={(e) => setSelectedSem(Number(e.target.value))}
            className="bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {semesters.map((sem, idx) => (
              <option key={idx} value={idx + 1} className="bg-gray-800 text-white">
                {sem}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Branch Dropdown */}
        <div className="relative">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {branches.map((branch) => (
              <option key={branch} value={branch} className="bg-gray-800 text-white">
                {branch}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* PDF Viewer */}
      <div className="flex-grow w-full h-[80vh] rounded-lg border border-white/10 overflow-hidden">
        <iframe
          src={getPdfPath()}
          className="w-full h-full"
          frameBorder="0"
          title="Syllabus PDF"
        />
      </div>
    </div>
  );
}

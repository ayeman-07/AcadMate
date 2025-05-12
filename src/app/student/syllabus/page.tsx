"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const subjectsBySem: Record<number, string[]> = {
    1: ["Mathematics I", "Physics I"],
    2: ["Mathematics II", "Physics II"],
    3: ["Data Structures", "Digital Logic"],
    4: ["Algorithms", "Operating Systems"],
    5: ["Computer Networks", "Database Systems"],
    6: ["Software Engineering", "Compiler Design"],
    7: ["Machine Learning", "Cloud Computing"],
    8: ["Project", "Elective"],
  };

  const pdfBySubject: Record<string, string> = {
    "Mathematics I": "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Physics I": "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Mathematics II":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Physics II":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Data Structures":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Digital Logic":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Algorithms":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Operating Systems":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Computer Networks":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Database Systems":  "https://www.antennahouse.com/hubfs/xsl-fo-sample/pdf/basic-link-1.pdf",
    "Software Engineering":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Compiler Design":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Machine Learning":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Cloud Computing":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Project":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
    "Elective":  "https://drive.google.com/file/d/11_AUvYg0vvj98Wl8h5EYNtECCK03SWX8/view?usp=sharing",
  };

  const currentSem = 5;
  const [selectedSem, setSelectedSem] = useState<number>(currentSem);
  const [selectedSubj, setSelectedSubj] = useState<string>(
    subjectsBySem[currentSem][0]
  );

  const subjectList = subjectsBySem[selectedSem] || [];
  const pdfSrc = pdfBySubject[selectedSubj] || "";

  return (
    <div className="space-y-6">
      {/* Header with two dropdowns */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Syllabus</h1>
        <div className="flex gap-4">
          {/* Semester Dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={selectedSem}
              onChange={(e) => {
                const sem = Number(e.target.value);
                setSelectedSem(sem);
                setSelectedSubj(subjectsBySem[sem][0]);
              }}
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

          {/* Subject Dropdown */}
          <div className="relative inline-block text-left">
            <select
              value={selectedSubj}
              onChange={(e) => setSelectedSubj(e.target.value)}
              className="bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {subjectList.map((subj) => (
                <option key={subj} value={subj} className="bg-gray-800 text-white">
                  {subj}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 h-[80vh]">
        {pdfSrc ? (
          <iframe
            src={pdfSrc}
            className="w-full h-full"
            frameBorder="0"
          />
        ) : (
          <p className="text-center text-gray-400 mt-20">No syllabus available.</p>
        )}
      </div>
    </div>
  );
}

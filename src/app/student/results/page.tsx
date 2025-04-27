"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";

export default function ResultsPage() {
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

  const currentSemester = 5; // Default selected semester
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);

  // Hardcoded marks data
  const resultsData: { [key: number]: { subject: string; quiz1: string; midsem: string; quiz2: string; endsem: string; }[] } = {
    5: [
      {
        subject: "Operating Systems",
        quiz1: "27/30",
        midsem: "42/50",
        quiz2: "26/30",
        endsem: "Pending",
      },
      {
        subject: "Computer Networks",
        quiz1: "28/30",
        midsem: "44/50",
        quiz2: "29/30",
        endsem: "Pending",
      },
      {
        subject: "Database Systems",
        quiz1: "26/30",
        midsem: "41/50",
        quiz2: "27/30",
        endsem: "Pending",
      },
      {
        subject: "Software Engineering",
        quiz1: "25/30",
        midsem: "39/50",
        quiz2: "Pending",
        endsem: "Pending",
      },
    ],
    4: [
      {
        subject: "Data Structures",
        quiz1: "26/30",
        midsem: "43/50",
        quiz2: "27/30",
        endsem: "81/100",
      },
      {
        subject: "Discrete Mathematics",
        quiz1: "24/30",
        midsem: "42/50",
        quiz2: "25/30",
        endsem: "79/100",
      },
    ],
    3: [
      {
        subject: "Digital Logic Design",
        quiz1: "23/30",
        midsem: "40/50",
        quiz2: "24/30",
        endsem: "77/100",
      },
      {
        subject: "Object Oriented Programming",
        quiz1: "27/30",
        midsem: "45/50",
        quiz2: "28/30",
        endsem: "85/100",
      },
    ],
  };

  const subjects = resultsData[selectedSemester] || [];

  return (
    <div className="space-y-6">
      {/* Header with Dropdown */}
      <div className="flex justify-between items-center">
  <h1 className="text-2xl font-bold">Results</h1>
  <div className="relative inline-block text-left">
    <select
      className="bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      value={selectedSemester}
      onChange={(e) => setSelectedSemester(Number(e.target.value))}
    >
      {semesters.map((sem, idx) => (
        <option key={idx} value={idx + 1} className="bg-gray-800 text-white">
          {sem}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
</div>

      {/* Results Table */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Quiz 1</th>
              <th className="py-2 px-4">Midsem</th>
              <th className="py-2 px-4">Quiz 2</th>
              <th className="py-2 px-4">Endsem</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, idx) => (
              <tr key={idx} className="border-t border-white/10">
                <td className="py-3 px-4 font-semibold">{subject.subject}</td>
                <td className="py-3 px-4">{subject.quiz1}</td>
                <td className="py-3 px-4">{subject.midsem}</td>
                <td className="py-3 px-4">{subject.quiz2}</td>
                <td className="py-3 px-4">{subject.endsem}</td>
              </tr>
            ))}
            {subjects.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No results available for this semester.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

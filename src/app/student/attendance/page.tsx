"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AttendancePage() {
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
  const [selectedSem, setSelectedSem] = useState("Semester 5");

  const attendanceData = [
    {
      subject: "Mathematics",
      totalTheory: 40,
      attendedTheory: 30,
      totalPractical: 10,
      attendedPractical: 8,
    },
    {
      subject: "Physics",
      totalTheory: 38,
      attendedTheory: 27,
      totalPractical: 12,
      attendedPractical: 9,
    },
    {
      subject: "Chemistry",
      totalTheory: 36,
      attendedTheory: 34,
      totalPractical: 14,
      attendedPractical: 13,
    },
    {
      subject: "Computer Science",
      totalTheory: 42,
      attendedTheory: 40,
      totalPractical: 16,
      attendedPractical: 16,
    },
  ];

  const calculatePercentage = (attended: number, total: number) =>
    total === 0 ? 0 : Math.round((attended / total) * 100);

  return (
    <div className="space-y-6">
      {/* Top Bar with Dropdown */}
      <div className="flex justify-end">
  <div className="relative inline-block text-left">
    <select
      value={selectedSem}
      onChange={(e) => setSelectedSem(e.target.value)}
      className="bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      {semesters.map((sem) => (
        <option key={sem} value={sem} className="bg-gray-800 text-white">
          {sem}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
  </div>
</div>

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/5 backdrop-blur-lg rounded-xl overflow-hidden border border-white/10">
          <thead>
            <tr className="text-left text-gray-400 uppercase text-sm">
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Total Theory</th>
              <th className="px-6 py-4">Attended Theory</th>
              <th className="px-6 py-4">Total Practical</th>
              <th className="px-6 py-4">Attended Practical</th>
              <th className="px-6 py-4">Theory %</th>
              <th className="px-6 py-4">Practical %</th>
              <th className="px-6 py-4">Overall %</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((subject) => {
              const theoryPercent = calculatePercentage(
                subject.attendedTheory,
                subject.totalTheory
              );
              const practicalPercent = calculatePercentage(
                subject.attendedPractical,
                subject.totalPractical
              );
              const overallPercent = Math.round(
                (subject.attendedTheory + subject.attendedPractical) /
                  (subject.totalTheory + subject.totalPractical) *
                  100
              );

              const isLowAttendance = overallPercent < 75;

              return (
                <tr
                  key={subject.subject}
                  className={`border-b border-white/10 ${
                    isLowAttendance
                      ? "border-l-4 border-l-red-500 bg-red-500/10"
                      : ""
                  }`}
                >
                  <td className="px-6 py-4 font-medium">{subject.subject}</td>
                  <td className="px-6 py-4">{subject.totalTheory}</td>
                  <td className="px-6 py-4">{subject.attendedTheory}</td>
                  <td className="px-6 py-4">{subject.totalPractical}</td>
                  <td className="px-6 py-4">{subject.attendedPractical}</td>
                  <td className="px-6 py-4">{theoryPercent}%</td>
                  <td className="px-6 py-4">{practicalPercent}%</td>
                  <td className="px-6 py-4">{overallPercent}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

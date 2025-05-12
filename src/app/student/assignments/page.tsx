"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function AssignmentsPage() {
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
  const currentSem = 5;
  const [selectedSem, setSelectedSem] = useState(currentSem);

  // Hardcoded pending assignments data by semester
  const assignmentsData: Record<number, { subject: string; title: string; due: string; url: string }[]> = {
    5: [
      {
        subject: "Mathematics",
        title: "Integration Techniques",
        due: "May 5, 2025",
        url: "https://classroom.google.com/",
      },
      {
        subject: "Physics",
        title: "Electromagnetism Worksheet",
        due: "May 8, 2025",
        url: "https://classroom.google.com/",
      },
      {
        subject: "Computer Networks",
        title: "TCP/IP Assignment",
        due: "May 10, 2025",
        url: "https://classroom.google.com/",
      },
    ],
    4: [
      {
        subject: "Data Structures",
        title: "Binary Trees",
        due: "April 30, 2025",
        url: "https://classroom.google.com/",
      },
    ],
  };

  const pending = assignmentsData[selectedSem] || [];

  return (
    <div className="space-y-6">
      {/* Header with Dropdown */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Assignments</h1>
        <div className="relative inline-block text-left">
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
      </div>

      {/* Pending Assignments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pending.length > 0 ? (
          pending.map((a, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 flex flex-col justify-between"
            >
              <div>
                <p className="text-gray-400 text-sm">{a.subject}</p>
                <h3 className="text-lg font-semibold mt-2">{a.title}</h3>
                <p className="text-gray-400 mt-1">Due: {a.due}</p>
              </div>
              <a
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-indigo-400 hover:underline"
              >
                View in Classroom
              </a>
            </div>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center py-8">
            No pending assignments for this semester.
          </p>
        )}
      </div>
    </div>
  );
}

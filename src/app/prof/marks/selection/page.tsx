// app/professor/marks-entry/selection/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, ClipboardList, GraduationCap, FileText } from "lucide-react";

const semesters = [1, 2, 3, 4, 5, 6, 7, 8];
const sections = ["A", "B", "C"];
const subjects = [
  { id: "sub1", name: "Mathematics" },
  { id: "sub2", name: "Physics" },
  { id: "sub3", name: "Chemistry" },
];
const exams = [
  { id: "quiz1", name: "Quiz 1" },
  { id: "midterm", name: "Midterm" },
  { id: "final", name: "Final Exam" },
];

export default function SelectionPage() {
  const router = useRouter();
  const [semester, setSemester] = useState(5);
  const [section, setSection] = useState("A");
  const [subject, setSubject] = useState("sub1");
  const [exam, setExam] = useState("quiz1");

  const handleProceed = () => {
    router.push(
      `/prof/marks/entry?semester=${semester}&section=${section}&subject=${subject}&exam=${exam}`
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Select Exam Context</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Semester Selection */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <label className="block text-gray-400 mb-2">Semester</label>
          <div className="relative">
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <GraduationCap className="absolute right-2 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Section Selection */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <label className="block text-gray-400 mb-2">Section</label>
          <div className="relative">
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="w-full bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {sections.map((sec) => (
                <option key={sec} value={sec}>
                  Section {sec}
                </option>
              ))}
            </select>
            <ClipboardList className="absolute right-2 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Subject Selection */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <label className="block text-gray-400 mb-2">Subject</label>
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {subjects.map((subj) => (
                <option key={subj.id} value={subj.id}>
                  {subj.name}
                </option>
              ))}
            </select>
            <BookOpen className="absolute right-2 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Exam Selection */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <label className="block text-gray-400 mb-2">Exam</label>
          <div className="relative">
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="w-full bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {exams.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
            <FileText className="absolute right-2 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleProceed}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Proceed to Marks Entry
        </button>
      </div>
    </div>
  );
}

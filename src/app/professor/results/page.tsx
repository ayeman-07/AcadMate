"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, BarChart2, Download } from "lucide-react";
import { ExamSelector, ExamType } from "@/components/professor/ExamSelector";

// Mock data for demonstration
const sections = [
  { id: "1", name: "Section A", semester: 3, department: "CSE" },
  { id: "2", name: "Section B", semester: 3, department: "CSE" },
  { id: "3", name: "Section A", semester: 5, department: "ECE" },
];

const results = [
  {
    id: "1",
    name: "John Doe",
    rollNo: "CSE2023001",
    quiz1: 8,
    quiz2: 9,
    midsem: 25,
    endsem: 42,
    total: 84,
    grade: "A",
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNo: "CSE2023002",
    quiz1: 9,
    quiz2: 8,
    midsem: 28,
    endsem: 45,
    total: 90,
    grade: "A+",
  },
  // Add more students as needed
];

const gradeDistribution = {
  "A+": 5,
  A: 15,
  "B+": 20,
  B: 25,
  C: 15,
  D: 10,
  F: 5,
};

export default function ResultsView() {
  const [selectedSection, setSelectedSection] = useState(sections[0].id);
  const [selectedExam, setSelectedExam] = useState<ExamType>("quiz1");

  const handleDownloadResults = () => {
    // Here you would typically generate and download a PDF or Excel file
    console.log("Downloading results for section:", selectedSection);
    alert("Results downloaded successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Results</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownloadResults}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-5 h-5" />
          Download Results
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section and Exam Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-white bg-indigo-950/80 backdrop-blur-sm border border-indigo-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 appearance-none cursor-pointer hover:bg-indigo-900/80"
              >
                {sections.map((section) => (
                  <option
                    key={section.id}
                    value={section.id}
                    className="bg-indigo-950 text-white hover:bg-indigo-900"
                  >
                    {section.name} - {section.department} Sem {section.semester}
                  </option>
                ))}
              </select>
              <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <ExamSelector
              selectedExam={selectedExam}
              onExamChange={setSelectedExam}
            />
          </div>
        </motion.div>

        {/* Grade Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">Grade Distribution</h2>
          <div className="space-y-4">
            {Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="flex items-center gap-4">
                <div className="w-16 text-center font-medium">{grade}</div>
                <div className="flex-1 h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${(count / 100) * 100}%` }}
                  />
                </div>
                <div className="w-16 text-right">{count}%</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Results Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-6 text-left text-gray-300">Roll No</th>
                <th className="py-4 px-6 text-left text-gray-300">Name</th>
                <th className="py-4 px-6 text-left text-gray-300">Quiz 1</th>
                <th className="py-4 px-6 text-left text-gray-300">Quiz 2</th>
                <th className="py-4 px-6 text-left text-gray-300">Mid Sem</th>
                <th className="py-4 px-6 text-left text-gray-300">End Sem</th>
                <th className="py-4 px-6 text-left text-gray-300">Total</th>
                <th className="py-4 px-6 text-left text-gray-300">Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="py-4 px-6 text-white">{student.rollNo}</td>
                  <td className="py-4 px-6 text-white">{student.name}</td>
                  <td className="py-4 px-6 text-white">{student.quiz1}/10</td>
                  <td className="py-4 px-6 text-white">{student.quiz2}/10</td>
                  <td className="py-4 px-6 text-white">{student.midsem}/30</td>
                  <td className="py-4 px-6 text-white">{student.endsem}/50</td>
                  <td className="py-4 px-6 text-white">{student.total}/100</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.grade === "A+"
                          ? "bg-green-500/20 text-green-400"
                          : student.grade === "A"
                          ? "bg-blue-500/20 text-blue-400"
                          : student.grade === "B+"
                          ? "bg-indigo-500/20 text-indigo-400"
                          : student.grade === "B"
                          ? "bg-purple-500/20 text-purple-400"
                          : student.grade === "C"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : student.grade === "D"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 
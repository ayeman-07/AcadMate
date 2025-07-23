"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export type ExamType = "quiz1" | "quiz2" | "midsem" | "endsem";

interface ExamSelectorProps {
  selectedExam: ExamType;
  onExamChange: (exam: ExamType) => void;
}

const examTypes = [
  { id: "quiz1", name: "Quiz 1", maxMarks: 10 },
  { id: "quiz2", name: "Quiz 2", maxMarks: 10 },
  { id: "midsem", name: "Mid Semester", maxMarks: 30 },
  { id: "endsem", name: "End Semester", maxMarks: 50 },
] as const;

export function ExamSelector({ selectedExam, onExamChange }: ExamSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedExam}
        onChange={(e) => onExamChange(e.target.value as ExamType)}
        className="w-64 pl-10 pr-10 py-2.5 text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 appearance-none cursor-pointer hover:bg-black/40"
      >
        {examTypes.map((exam) => (
          <option
            key={exam.id}
            value={exam.id}
            className="bg-black/80 text-white hover:bg-indigo-600"
          >
            {exam.name} (Max: {exam.maxMarks})
          </option>
        ))}
      </select>
      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    </div>
  );
} 
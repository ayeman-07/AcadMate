"use client";

import React from "react";
import { ExamType } from "./ExamSelector";

interface Student {
  id: string;
  name: string;
  rollNo: string;
  section: string;
}

interface StudentMarksTableProps {
  students: Student[];
  selectedExam: ExamType;
  marks: Record<string, number>;
  onMarkChange: (studentId: string, marks: number) => void;
}

const examMaxMarks: Record<ExamType, number> = {
  quiz1: 10,
  quiz2: 10,
  midsem: 30,
  endsem: 50,
};

export function StudentMarksTable({
  students,
  selectedExam,
  marks,
  onMarkChange,
}: StudentMarksTableProps) {
  const maxMarks = examMaxMarks[selectedExam];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="py-4 px-6 text-left text-gray-300">Roll No</th>
            <th className="py-4 px-6 text-left text-gray-300">Name</th>
            <th className="py-4 px-6 text-left text-gray-300">Section</th>
            <th className="py-4 px-6 text-left text-gray-300">Marks (Max: {maxMarks})</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="border-b border-white/5 hover:bg-white/5"
            >
              <td className="py-4 px-6 text-white">{student.rollNo}</td>
              <td className="py-4 px-6 text-white">{student.name}</td>
              <td className="py-4 px-6 text-white">{student.section}</td>
              <td className="py-4 px-6">
                <input
                  type="number"
                  value={marks[student.id] || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 0 && value <= maxMarks) {
                      onMarkChange(student.id, value);
                    }
                  }}
                  className="w-20 pl-3 pr-2 py-1 text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200"
                  placeholder="Marks"
                  min="0"
                  max={maxMarks}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { ExamSelector, ExamType } from "@/components/professor/ExamSelector";
import { StudentMarksTable } from "@/components/professor/StudentMarksTable";

// Hardcoded data for demonstration
const sections = [
  { id: "1", name: "Section A", semester: 3, department: "CSE" },
  { id: "2", name: "Section B", semester: 3, department: "CSE" },
  { id: "3", name: "Section A", semester: 5, department: "ECE" },
];

const students = [
  {
    id: "1",
    name: "John Doe",
    rollNo: "CSE2023001",
    section: "Section A",
    semester: 3,
    department: "CSE",
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNo: "CSE2023002",
    section: "Section A",
    semester: 3,
    department: "CSE",
  },
  // Add more students as needed
];

export default function MarksEntry() {
  const [selectedSection, setSelectedSection] = useState(sections[0].id);
  const [selectedExam, setSelectedExam] = useState<ExamType>("quiz1");
  const [studentMarks, setStudentMarks] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkChange = (studentId: string, marks: number) => {
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: marks,
    }));
  };

  const handleSubmitMarks = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically make an API call to save the marks
      console.log("Submitting marks:", {
        examType: selectedExam,
        sectionId: selectedSection,
        marks: studentMarks,
      });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert("Marks submitted successfully!");
      setStudentMarks({}); // Clear marks after successful submission
    } catch (error) {
      console.error("Error submitting marks:", error);
      alert("Failed to submit marks. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marks Entry</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 appearance-none cursor-pointer hover:bg-black/40"
            >
              {sections.map((section) => (
                <option
                  key={section.id}
                  value={section.id}
                  className="bg-black/80 text-white hover:bg-indigo-600"
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

        <StudentMarksTable
          students={students}
          selectedExam={selectedExam}
          marks={studentMarks}
          onMarkChange={handleMarkChange}
        />

        <div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitMarks}
            disabled={isSubmitting}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </div>
            ) : (
              "Submit Marks"
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
} 
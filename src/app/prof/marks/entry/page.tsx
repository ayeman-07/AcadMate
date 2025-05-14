// app/professor/marks-entry/entry/page.tsx
"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

// Mock data for demonstration
const students = [
  { id: "1", name: "John Doe", rollNo: "CSE2023001" },
  { id: "2", name: "Jane Smith", rollNo: "CSE2023002" },
  // Add more students as needed
];

export default function MarksEntryPage() {
  const searchParams = useSearchParams();
  const semester = searchParams.get("semester");
  const section = searchParams.get("section");
  const subject = searchParams.get("subject");
  const exam = searchParams.get("exam");

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
        examType: exam,
        semester,
        section,
        subject,
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
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold mb-6">Marks Entry</h1>

      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <p className="text-gray-400 mb-4">
          <strong>Semester:</strong> {semester} &nbsp; | &nbsp;
          <strong>Section:</strong> {section} &nbsp; | &nbsp;
          <strong>Subject:</strong> {subject} &nbsp; | &nbsp;
          <strong>Exam:</strong> {exam}
        </p>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Roll No</th>
              <th className="py-2">Name</th>
              <th className="py-2">Marks</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-t border-white/10">
                <td className="py-2">{student.rollNo}</td>
                <td className="py-2">{student.name}</td>
                <td className="py-2">
                  <input
                    type="number"
                    value={studentMarks[student.id] || ""}
                    onChange={(e) =>
                      handleMarkChange(student.id, Number(e.target.value))
                    }
                    className="w-24 bg-gray-800 text-white border border-white/20 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmitMarks}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isSubmitting
                ? "bg-gray-600 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Marks"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

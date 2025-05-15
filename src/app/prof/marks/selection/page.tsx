"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, GraduationCap, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

type TeachingAssignment = {
  _id: string;
  professor: {
    _id: string;
    name: string;
    email: string;
  };
  subject: {
    _id: string;
    code?: string;
    name?: string;
  };
  batchCode: string;
  semester: number;
  year: string;
};

export default function TeachingAssignmentPage() {
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/teaching-assignments");
        if (!res.ok) throw new Error("Failed to fetch assignments");
        const data = await res.json();
        setAssignments(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleSelect = (assignment: TeachingAssignment) => {
    const queryParams = new URLSearchParams({
      semester: assignment.semester.toString(),
      subject: assignment.subject._id,
      batchCode: assignment.batchCode,
    });

    router.push(`/prof/marks/entry?${queryParams.toString()}`);
  };

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (assignments.length === 0)
    return (
      <div className="text-white text-center mt-10">No assignments found.</div>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4 text-white">
        Your Teaching Assignments
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => handleSelect(assignment)}
          >
            <div className="mb-2 text-white text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              {assignment.subject.name || assignment.subject._id || "N/A"}{" "}
              <span className="text-gray-400">
                ({assignment.subject.code || "N/A"})
              </span>
            </div>

            <div className="text-sm text-gray-300 mb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Semester {assignment.semester} - {assignment.batchCode} (
              {assignment.year})
            </div>

            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {assignment.professor.name} ({assignment.professor.email})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

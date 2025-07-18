"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, GraduationCap } from "lucide-react";

interface Assignment {
  _id: string;
  subject: {
    _id: string;
    name: string;
    code?: string;
  };
  batchCode: string;
  semester: number;
  year: string;
}

export default function ResultsSelectionPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
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
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const handleSelect = (assignment: Assignment) => {
    const queryParams = new URLSearchParams({
      subject: assignment.subject.name || "",
      batchCode: assignment.batchCode,
      semester: assignment.semester.toString(),
    });
    router.push(`/prof/results/view-result?${queryParams.toString()}`);
  };

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
  if (assignments.length === 0)
    return <div className="text-white text-center mt-10">No assignments found.</div>;

  return (
    <div className="p-6 min-h-screen bg-black text-white">
      <h1 className="text-4xl font-extrabold mb-8 text-white/90 tracking-tight">
        Select Batch & Subject to View Results
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.map((assignment) => (
          <div
            key={assignment._id}
            onClick={() => handleSelect(assignment)}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-blue-500/30 hover:border-blue-400/60 cursor-pointer group"
          >
            <div className="flex items-center mb-3">
              <BookOpen className="w-5 h-5 text-blue-400 mr-2" />
              <h2 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                {assignment.subject.name}
                <span className="ml-2 text-sm text-gray-400 font-normal">
                  ({assignment.batchCode || "Code N/A"})
                </span>
              </h2>
            </div>
            <div className="flex items-center text-sm text-gray-300 mb-2">
              <GraduationCap className="w-4 h-4 mr-2" />
              Semester {assignment.semester} — {assignment.batchCode} ({assignment.year})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

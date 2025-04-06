"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BookOpen, Calendar, Clock, GraduationCap, Hash, Pencil, School, Type, User } from "lucide-react";
import { FormInput } from "../ui/FormInput";

interface Professor {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
}

export default function CreateExamForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [selectedProfessor, setSelectedProfessor] = useState("");

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await fetch("/api/user-mgmt/professor");
        if (!response.ok) throw new Error("Failed to fetch professors");
        const data = await response.json();
        setProfessors(data.professors);
      } catch (err) {
        setError("Failed to load professors");
      }
    };
    fetchProfessors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const examData = {
      title: formData.get("title"),
      subject: formData.get("subject"),
      examType: formData.get("examType"),
      semester: Number(formData.get("semester")),
      department: formData.get("department"),
      maxMarks: Number(formData.get("maxMarks")),
      examDate: formData.get("examDate"),
      duration: Number(formData.get("duration")),
      paperSetter: selectedProfessor,
    };

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to create exam");
      }

      router.push("/admin/exams");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create exam");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10"
      >
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Create New Exam
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              id="title"
              name="title"
              type="text"
              label="Exam Title"
              placeholder="Enter exam title"
              icon={Pencil}
              required
            />

            <FormInput
              id="subject"
              name="subject"
              type="text"
              label="Subject"
              placeholder="Enter subject name"
              icon={BookOpen}
              required
            />

            <FormInput
              id="examType"
              name="examType"
              type="text"
              label="Exam Type"
              placeholder="e.g., Quiz, Mid Term, End Sem"
              icon={Type}
              required
            />

            <FormInput
              id="semester"
              name="semester"
              type="number"
              label="Semester"
              placeholder="Enter semester number"
              icon={Hash}
              required
            />

            <FormInput
              id="department"
              name="department"
              type="text"
              label="Department"
              placeholder="e.g., CSE, ECE"
              icon={School}
              required
            />

            <FormInput
              id="maxMarks"
              name="maxMarks"
              type="number"
              label="Maximum Marks"
              placeholder="Enter maximum marks"
              icon={GraduationCap}
              required
            />

            <FormInput
              id="examDate"
              name="examDate"
              type="datetime-local"
              label="Exam Date & Time"
              placeholder=""
              icon={Calendar}
              required
            />

            <FormInput
              id="duration"
              name="duration"
              type="number"
              label="Duration (minutes)"
              placeholder="Enter duration in minutes"
              icon={Clock}
              required
            />

            <div className="space-y-2">
              <label
                htmlFor="paperSetter"
                className="text-sm font-medium text-gray-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Paper Setter
              </label>
              <div className="relative">
                <select
                  id="paperSetter"
                  name="paperSetter"
                  value={selectedProfessor}
                  onChange={(e) => setSelectedProfessor(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2.5 text-white bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 appearance-none cursor-pointer hover:bg-black/40"
                >
                  <option value="" className="bg-black/80 text-gray-300">
                    Select a professor
                  </option>
                  {professors.map((professor) => (
                    <option 
                      key={professor._id} 
                      value={professor._id}
                      className="bg-black/80 text-white hover:bg-indigo-600"
                    >
                      {professor.name} ({professor.department}) - {professor.designation}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Exam"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
} 
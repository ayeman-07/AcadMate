"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Clock, GraduationCap, Hash, Type } from "lucide-react";
import { FormInput } from "@/components/ui/FormInput";
import TagInput from "@/components/ui/TagInput";
import DatePickerInput from "@/components/ui/DatePickerInput";

export default function CreateExamForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departmentTags, setDepartmentTags] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [examType, setExamType] = useState("");
  const [semester, setSemester] = useState<number | null>(null);
  const [maxMarks, setMaxMarks] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [step, setStep] = useState(1);

  // For step 2: subject list
  const [subjects, setSubjects] = useState<
    { subjectName: string; paperSetter: string; examDate: string }[]
  >([]);

  const [professors, setProfessors] = useState<{ _id: string; name: string }[]>([]);


  useEffect(() => {
    const fetchProfessors = async () => {
      const res = await fetch("/api/user-mgmt/professor?page=1&limit=50");
      const data = await res.json();
      if (res.ok) setProfessors(data.professors);
    };
    fetchProfessors();
  }, []);


  const addSubject = () => {
    setSubjects([...subjects, { subjectName: "", paperSetter: "", examDate: "" }]);
  };

  const updateSubject = (index: number, field: string, value: string) => {
    const updated = [...subjects];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setSubjects(updated);
  };

  const removeSubject = (index: number) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

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
      department: departmentTags.join(","),
      maxMarks: Number(formData.get("maxMarks")),
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      duration: Number(formData.get("duration")),
    };

    try {
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      {step === 1 && (
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
                id="examType"
                name="examType"
                type="text"
                label="Exam Type"
                placeholder="e.g., Quiz, Mid Term, End Sem"
                icon={Type}
                required
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
              />

              <FormInput
                id="semester"
                name="semester"
                type="number"
                label="Semester"
                placeholder="Enter semester number"
                icon={Hash}
                required
                value={semester?.toString() || ""}
                onChange={(e) => setSemester(Number(e.target.value))}
              />

              <TagInput
                tags={departmentTags}
                setTags={setDepartmentTags}
                label="Departments"
                placeholder="Type and press Enter (e.g., CSE, ECE)"
              />

              <FormInput
                id="maxMarks"
                name="maxMarks"
                type="number"
                label="Maximum Marks"
                placeholder="Enter maximum marks"
                icon={GraduationCap}
                required
                value={maxMarks?.toString() || ""}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
              />

              <DatePickerInput
                label="Start Date"
                name="startDate"
                selectedDate={startDate}
                onChange={setStartDate}
                required
              />

              <DatePickerInput
                label="End Date"
                name="endDate"
                selectedDate={endDate}
                onChange={setEndDate}
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
                value={duration?.toString() || ""}
                onChange={(e) => setDuration(Number(e.target.value))}
              />
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
              onClick={() => setStep(2)}
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
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 ml-2">
            Add Subjects
          </h2>

          <div className="space-y-6">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-zinc-900 p-6 rounded-xl border border-white/10 relative"
              >
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-white">Subject Name</label>
                  <input
                    type="text"
                    value={subject.subjectName}
                    onChange={(e) =>
                      updateSubject(index, "subjectName", e.target.value)
                    }
                    placeholder="Enter subject"
                    className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-white">Paper Setter</label>
                  <select
                    value={subject.paperSetter}
                    onChange={(e) =>
                      updateSubject(index, "paperSetter", e.target.value)
                    }
                    className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-md"
                    required
                  >
                    <option value="">Select Professor</option>
                    {professors.map((prof) => (
                      <option key={prof._id} value={prof.name}>
                        {prof.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-white">Exam Date</label>
                  <input
                    type="date"
                    value={subject.examDate}
                    onChange={(e) =>
                      updateSubject(index, "examDate", e.target.value)
                    }
                    className="bg-zinc-800 border border-zinc-700 text-white px-3 py-2 rounded-md [&::-webkit-calendar-picker-indicator]:invert"
                    required
                  />
                </div>

                {subjects.length > 3 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="absolute top-2 right-2 text-red-400 text-xs hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <div className="text-center">
              <button
                type="button"
                onClick={addSubject}
                className="bg-indigo-700 hover:bg-indigo-800 text-white px-4 py-2 rounded-md"
              >
                + Add Subject
              </button>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded-lg"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={() => {
                const sortedSubjects = [...subjects].sort((a, b) =>
                  a.examDate.localeCompare(b.examDate)
                );
                setSubjects(sortedSubjects);
                setStep(3);
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Preview →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Preview Exam Notice
          </h2>

          <div className="space-y-6 text-white text-sm">
            <p>
              This is to notify all students that the{" "}
              <strong>{examType}</strong> examination for semester{" "}
              <strong>{semester}</strong> will commence from{" "}
              <strong>{startDate?.toLocaleDateString()}</strong> and conclude on{" "}
              <strong>{endDate?.toLocaleDateString()}</strong>. Each paper will
              be of <strong>{duration} minutes</strong> duration and will carry
              a maximum of <strong>{maxMarks} marks</strong>. The exams will be
              held for the following subjects:
            </p>

            <table className="w-full text-white border border-white/10 rounded-lg overflow-hidden text-sm">
              <thead className="bg-white/10 text-left">
                <tr>
                  <th className="py-2 px-4 border-r border-white/10">
                    Subject Name
                  </th>
                  <th className="py-2 px-4 border-r border-white/10">
                    Paper Setter
                  </th>
                  <th className="py-2 px-4">Exam Date</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="py-2 px-4">{subject.subjectName}</td>
                    <td className="py-2 px-4">{subject.paperSetter}</td>
                    <td className="py-2 px-4">
                      {new Date(subject.examDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div>
              <p className="mt-6 text-white/80">
                <strong>Departments:</strong> {departmentTags.join(", ")}
              </p>
              <p className="text-white/80">
                <strong>Maximum Marks:</strong> {maxMarks} |{" "}
                <strong>Duration:</strong> {duration} minutes
              </p>
            </div>
          </div>

          <div className="flex justify-between mt-10">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-800 text-white rounded-lg"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={async () => {
                setIsSubmitting(true);
                setError("");

                const formattedSubjects = subjects.map((subj) => {
                  const professor = professors.find(
                    (p) => p.name === subj.paperSetter
                  );
                  return {
                    name: subj.subjectName,
                    professor: professor?._id,
                    examDate: new Date(subj.examDate).toISOString(),
                  };
                });

                const examData = {
                  examType,
                  semester,
                  departments: departmentTags,
                  maxMarks,
                  startDate: startDate?.toISOString(),
                  endDate: endDate?.toISOString(),
                  duration,
                  subjects: formattedSubjects,
                };

                try {
                  const response = await fetch("/api/exams", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(examData),
                  });

                  if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to create exam");
                  }

                  router.push("/admin/exams");
                  router.refresh();
                } catch (err) {
                  setError(
                    err instanceof Error ? err.message : "Failed to create exam"
                  );
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              {isSubmitting ? "Submitting..." : "Submit Exam"}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

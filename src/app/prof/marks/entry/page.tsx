"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from 'react-hot-toast';

interface Student {
  _id: string;
  name: string;
  roll: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
  credits: number;
  isElective: boolean;
  isPractical: boolean;
}

const EXAMS = {
  quiz1: { label: "Quiz 1", max: 10 },
  quiz2: { label: "Quiz 2", max: 10 },
  midsem: { label: "Mid Sem", max: 30 },
  endsem: { label: "End Sem", max: 100 },
};

export default function MarksEntryPage() {
  const searchParams = useSearchParams();
  const semester = searchParams.get("semester");
  const subjectId = searchParams.get("subject");
  const batchCode = searchParams.get("batchCode");

  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [originalMarks, setOriginalMarks] = useState<Record<string, string>>(
    {}
  );
  // Store isUpdated per student for UI state management
  const [isUpdatedFlags, setIsUpdatedFlags] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<keyof typeof EXAMS>("quiz1");

  useEffect(() => {
    const fetchBatchData = async () => {
      if (!batchCode || !subjectId || !semester || !exam) return;

      setLoading(true);
      try {
        const res = await fetch("/api/teaching-assignments/fetch-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchCode, subjectId }),
        });

        const data = await res.json();
        if (data.success) {
          setStudents(data.students);
          setSubject(data.subject);

          const initialMarks: Record<string, string> = {};
          const initialUpdatedFlags: Record<string, boolean> = {};
          data.students.forEach((student: Student) => {
            initialMarks[student._id] = "0";
            initialUpdatedFlags[student._id] = false; // initially false
          });

          setMarks(initialMarks);
          setOriginalMarks(initialMarks);
          setIsUpdatedFlags(initialUpdatedFlags);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Failed to fetch batch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [batchCode, subjectId, semester, exam]);

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks((prev) => {
      const newMarks = { ...prev, [studentId]: value };

      // update isUpdated flag based on difference from original marks
      setIsUpdatedFlags((flags) => ({
        ...flags,
        [studentId]: value !== originalMarks[studentId],
      }));

      return newMarks;
    });
  };

  const handleSubmit = async () => {
    // Now send ALL entries, not only changed ones
    const allEntries = students.map((student) => ({
      studentId: student._id,
      marks: Number(marks[student._id]) || 0,
      // isUpdated = true if marks changed, else false
      isUpdated: isUpdatedFlags[student._id] === true,
    }));

    if (allEntries.length === 0) {
      toast("No students found.", { icon: "⚠️" });
      return;
    }

    const requestBody = {
      subjectId,
      batchCode,
      sem: semester,
      exam,
      entries: allEntries,
    };

    try {
      const res = await fetch("/api/result/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Marks submitted successfully");


        // Update originalMarks and reset all isUpdated flags to false after submit
        setOriginalMarks({ ...marks });
        const resetFlags: Record<string, boolean> = {};
        students.forEach((student) => {
          resetFlags[student._id] = false;
        });
        setIsUpdatedFlags(resetFlags);
      } else {
        console.error(data.error);
        toast.error("Failed to save marks");

      }
    } catch (error) {
      console.error("Error saving marks:", error);
      toast.error("Something went wrong.");

    }
  };

  if (loading) {
    return (
      <div className="p-6 text-xl text-white">Loading student data...</div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold text-white/90">📝 Marks Entry</h1>

      <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl space-y-1">
        <p>
          <strong className="text-gray-400">Semester:</strong> {semester}
        </p>
        <p>
          <strong className="text-gray-400">Subject:</strong> {subject?.name} (
          {subject?.code})
        </p>
        <p>
          <strong className="text-gray-400">Batch Code:</strong> {batchCode}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-2">
          <label className="text-gray-400 font-medium">Exam:</label>
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value as keyof typeof EXAMS)}
            className="bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-md"
          >
            {Object.entries(EXAMS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label} (Max: {val.max})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-gray-800">
        <table className="min-w-full text-left text-sm bg-gray-950 text-white">
          <thead className="bg-gray-800 text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-3 border-b border-gray-700">Roll No</th>
              <th className="px-6 py-3 border-b border-gray-700">Name</th>
              <th className="px-6 py-3 border-b border-gray-700">
                Marks (Max: {EXAMS[exam].max})
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className={`hover:bg-gray-800 transition border-b border-gray-800 ${
                  isUpdatedFlags[student._id] ? "bg-yellow-900" : ""
                }`}
              >
                <td className="px-6 py-4">{student.roll}</td>
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    min={0}
                    max={EXAMS[exam].max}
                    value={marks[student._id] || ""}
                    onChange={(e) =>
                      handleMarkChange(student._id, e.target.value)
                    }
                    className="w-24 px-2 py-1 rounded-md bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition"
      >
        Submit Marks
      </button>
    </div>
  );
}
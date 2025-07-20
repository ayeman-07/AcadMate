"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

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
  const subjectName = searchParams.get("subject");
  const batchCode = searchParams.get("batchCode");

  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [originalMarks, setOriginalMarks] = useState<Record<string, string>>(
    {}
  );
  const [isUpdatedFlags, setIsUpdatedFlags] = useState<Record<string, boolean>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<keyof typeof EXAMS>("quiz1");

  useEffect(() => {
    const fetchBatchData = async () => {
      if (!batchCode || !subjectName || !semester || !exam) return;

      setLoading(true);
      try {
        const res = await fetch("/api/teaching-assignments/fetch-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchCode, semester, subjectName }),
        });

        const data = await res.json();
        if (data.success) {
          setStudents(data.students);
          setSubject(data.subject);

          const initialMarks: Record<string, string> = {};
          const initialUpdatedFlags: Record<string, boolean> = {};
          data.students.forEach((student: Student) => {
            initialMarks[student._id] = "0";
            initialUpdatedFlags[student._id] = false;
          });

          setMarks(initialMarks);
          setOriginalMarks(initialMarks);
          setIsUpdatedFlags(initialUpdatedFlags);
        } else {
          toast.error(data.error || "Failed to load batch data");
        }
      } catch (error) {
        console.error("Failed to fetch batch data:", error);
        toast.error("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [batchCode, subjectName, semester, exam]);

  const handleMarkChange = (studentId: string, value: string) => {
    setMarks((prev) => {
      const newMarks = { ...prev, [studentId]: value };

      setIsUpdatedFlags((flags) => ({
        ...flags,
        [studentId]: value !== originalMarks[studentId],
      }));

      return newMarks;
    });
  };

  const handleSubmit = async () => {
    if (!subject?._id) {
      toast.error("Subject ID not available");
      return;
    }

    const allEntries = students.map((student) => ({
      studentId: student._id,
      marks: Number(marks[student._id]) || 0,
      isUpdated: isUpdatedFlags[student._id] === true,
    }));

    if (allEntries.length === 0) {
      toast("No students found.", { icon: "⚠️" });
      return;
    }

    const requestBody = {
      subjectName: subject?.name, // use optional chaining
      batchCode: `${batchCode?.split("-")[0]}${semester}0${
        batchCode?.split("-")[1]
      }`,
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
      console.log("Response data:", data);
      if (data.success) {
        toast.success("Marks submitted successfully");

        setOriginalMarks({ ...marks });
        const resetFlags: Record<string, boolean> = {};
        students.forEach((student) => {
          resetFlags[student._id] = false;
        });
        setIsUpdatedFlags(resetFlags);
      } else {
        toast.error("Failed to save marks");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white text-center text-lg">
        Loading student data...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-8">
      <h1 className="text-3xl font-bold text-white/90">📝 Marks Entry</h1>

      {/* Metadata Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Semester</p>
          <p className="text-white text-lg font-medium">{semester}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Subject</p>
          <p className="text-white text-lg font-medium">
            {subject?.name} ({subject?.code})
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Batch</p>
          <p className="text-white text-lg font-medium">{batchCode}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Exam</p>
          <select
            value={exam}
            onChange={(e) => setExam(e.target.value as keyof typeof EXAMS)}
            className="mt-1 w-full bg-gray-800 text-white border border-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(EXAMS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label} (Max: {val.max})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full bg-gray-950 text-white text-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-3 border-b border-gray-700 text-left">
                Roll No
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-left">
                Name
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-center">
                Marks (Max: {EXAMS[exam].max})
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className={`border-b border-gray-800 transition ${
                  isUpdatedFlags[student._id]
                    ? "bg-yellow-900/50"
                    : "hover:bg-gray-800"
                }`}
              >
                <td className="px-6 py-3 whitespace-nowrap text-left">
                  {student.roll}
                </td>
                <td className="px-6 py-3 whitespace-nowrap text-left">
                  {student.name}
                </td>
                <td className="px-6 py-3 text-center">
                  <input
                    type="number"
                    min={0}
                    max={EXAMS[exam].max}
                    value={marks[student._id] || ""}
                    onChange={(e) =>
                      handleMarkChange(student._id, e.target.value)
                    }
                    className={`w-24 px-3 py-1 rounded-md bg-gray-900 border text-center outline-none transition
                      ${
                        isUpdatedFlags[student._id]
                          ? "border-yellow-400 ring-yellow-400 ring-2"
                          : "border-gray-700 focus:border-blue-400 focus:ring-2 focus:ring-blue-500"
                      }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 text-white font-semibold rounded-lg shadow-md"
        >
          Submit Marks
        </button>
      </div>
    </div>
  );
}

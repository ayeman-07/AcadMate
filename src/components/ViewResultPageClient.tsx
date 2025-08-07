"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Student {
  _id: string;
  name: string;
  roll: string;
}

interface Result {
  exam: string;
  marksObtained: number;
  subject: string;
  student: string | { _id: string }; // for populated or plain
}

const EXAMS = [
  { key: "quiz1", label: "Quiz 1" },
  { key: "midsem", label: "Midsem" },
  { key: "quiz2", label: "Quiz 2" },
  { key: "endsem", label: "Endsem" },
];

export default function ViewResultPageClient() {
  const searchParams = useSearchParams();
    const subjectName = searchParams.get("subject");
    const batchCode = searchParams.get("batchCode");
    const semester = searchParams.get("semester");

  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Record<string, Result[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchBatchData = async () => {
      if (!subjectName || !batchCode || !semester) {
        setError("Missing required query parameters.");
        return;
      }

      const batchCodeStr = Array.isArray(batchCode) ? batchCode.join("") : batchCode;
      const modifiedBatchCode = batchCodeStr.replace("-", `${semester}0`);

      setLoading(true);

      try {
        // Fetch student list
        const res = await fetch("/api/teaching-assignments/fetch-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({batchCode, subjectName, semester }),
        });

        const data = await res.json();
        if (data.success) {
          setStudents(data.students);
        } else {
          setStudents([]);
          setError(data.error || "Failed to fetch students");
        }

        // Fetch marks
        const resultRes = await fetch("/api/result/fetch-marks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subjectName, batchCode: modifiedBatchCode, sem: semester }),
        });

        const rawText = await resultRes.text();
        if (!rawText) {
          throw new Error("Empty response from fetch-marks API.");
        }

        let resultData: { results?: Result[]; [key: string]: unknown };
        try {
          resultData = JSON.parse(rawText);
        } catch (jsonErr) {
          console.error("Failed to parse JSON:", jsonErr);
          console.error("JSON parse error:", rawText);
          throw new Error("Invalid JSON response from server.");
        }

       

        const grouped: Record<string, Result[]> = {};
        if (resultData?.results) {
          for (const r of resultData.results) {
            const studentId = typeof r.student === "string" ? r.student : r.student._id;
            if (!grouped[studentId]) grouped[studentId] = [];
            grouped[studentId].push(r);
          }
        }

        setResults(grouped);
      } catch (err: unknown) {
        console.error("Error fetching:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBatchData();
  }, [subjectName, batchCode, semester]);

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-8">
      <h2 className="text-3xl font-bold text-white/90 mb-6">📊 View Results</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full bg-gray-950 text-gray-300 text-sm rounded-lg overflow-hidden shadow-md">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 border-b border-gray-700 text-left">
                Roll No
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-left">
                Name
              </th>
              {EXAMS.map((exam) => (
                <th
                  key={exam.key}
                  className="px-6 py-3 border-b border-gray-700 text-center"
                >
                  {exam.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={2 + EXAMS.length}
                  className="px-6 py-8 text-center text-gray-400 italic border-t border-gray-800"
                >
                  No student records found.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const studentResults = results[student._id] || [];

                return (
                  <tr
                    key={student._id}
                    className="border-b border-gray-800 transition-all duration-150 hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-left">
                      {student.roll}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      {student.name}
                    </td>
                    {EXAMS.map((exam) => {
                      const res = studentResults.find(
                        (r) => r.exam === exam.key
                      );

                      return (
                        <td key={exam.key} className="px-6 py-4 text-center">
                          {res ? (
                            <span className="text-white">
                              {res.marksObtained}
                            </span>
                          ) : (
                            <span className="text-yellow-400 font-semibold">
                              Pending
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

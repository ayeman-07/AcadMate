"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import {enUS} from "date-fns/locale/en-US";
registerLocale("en-US", enUS);

interface Student {
  _id: string;
  name: string;
  roll?: string;
}

interface Subject {
  _id: string;
  name: string;
  code: string;
}

export default function AttendanceEntryPage() {
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subject");
  const batchCode = searchParams.get("batchCode");
  const semester = searchParams.get("semester");
  const [date, setDate] = useState<Date>(() => new Date());
  const [attendance, setAttendance] = useState<{ [studentId: string]: boolean }>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  

  useEffect(() => {
    const fetchStudents = async () => {
      if (!subjectName || !batchCode) {
        setError("Missing subject or batch code");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/teaching-assignments/fetch-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ batchCode, semester, subjectName }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to fetch students");
        setStudents(data.students);
        setSubject(data.subject);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [subjectName, batchCode]);

  // Calendar logic
  const handleCalendarChange = (date: Date | null) => {
    if (date) setDate(date);
    // TODO: Fetch attendance for this date if backend supports
  };

  const handleCheckbox = (id: string) => {
    setAttendance((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    // TODO: Implement save logic
    alert("Attendance saved! (not really, this is a placeholder)");
  };

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-8">
      <h2 className="text-3xl font-bold text-white/90 mb-6">📅 Attendance Entry</h2>
      {/* Metadata Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
      </div>
      {/* Calendar Section */}
      <div className="mb-4 max-w-xs w-full">
        <DatePicker
          selected={date}
          onChange={handleCalendarChange}
          locale="en-US"
          dateFormat="yyyy-MM-dd"
          calendarClassName="bg-gray-900 text-white border border-gray-800 rounded-lg shadow-lg"
          popperClassName="react-datepicker-popper"
          customInput={
            <div className="relative w-full">
              <input
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900 border-2 border-indigo-500 text-white text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow placeholder-gray-400"
                readOnly
                value={date.toLocaleDateString("en-CA")}
                placeholder="Select date"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <CalendarDays className="w-6 h-6 text-indigo-400" />
              </span>
            </div>
          }
        />
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="min-w-full bg-gray-950 text-white text-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-3 border-b border-gray-700 text-left">Roll No</th>
              <th className="px-6 py-3 border-b border-gray-700 text-left">Name</th>
              <th className="px-6 py-3 border-b border-gray-700 text-center">Present</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className={
                  `border-b border-gray-800 transition hover:bg-gray-800`
                }
              >
                <td className="px-6 py-3 whitespace-nowrap text-left">{student.roll}</td>
                <td className="px-6 py-3 whitespace-nowrap text-left">{student.name}</td>
                <td className="px-6 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={!!attendance[student._id]}
                    onChange={() => handleCheckbox(student._id)}
                    className="w-5 h-5 accent-indigo-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2 text-white font-semibold rounded-lg shadow-md"
        >
          Save Attendance
        </button>
      </div>
    </div>
  );
} 
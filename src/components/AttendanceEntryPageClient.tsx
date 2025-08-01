"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import { enUS } from "date-fns/locale/en-US";
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

export default function AttendanceEntryPageClient() {
  const searchParams = useSearchParams();
  const subjectName = searchParams.get("subject");
  const batchCode = searchParams.get("batchCode");
  const semester = searchParams.get("semester");

  const [date, setDate] = useState<Date>(() => new Date());
  const [attendance, setAttendance] = useState<{
    [studentId: string]: "present" | "absent";
  }>({});
  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingIds, setLoadingIds] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    const fetchStudents = async () => {
      if (!subjectName || !batchCode || !semester) {
        setError("Missing subject, batch code, or semester");
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
        if (!data.success)
          throw new Error(data.error || "Failed to fetch students");

        setStudents(data.students);
        setSubject(data.subject);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [subjectName, batchCode, semester]);

  useEffect(() => {
    const fetchAttendance = async (selectedDate: Date) => {
      try {
        const res = await fetch(
          `/api/attendance?batchCode=${batchCode}&semester=${semester}&date=${
            selectedDate.toISOString().split("T")[0]
          }`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.attendance)) {
          const newAttendance: { [studentId: string]: "present" | "absent" } =
            {};
          interface AttendanceRecord {
            studentId: string | { _id: string };
            isPresent: boolean;
          }

          (data.attendance as AttendanceRecord[]).forEach(
            (record: AttendanceRecord) => {
              const studentId =
                typeof record.studentId === "string"
                  ? record.studentId
                  : record.studentId._id;
              newAttendance[studentId] = record.isPresent
                ? "present"
                : "absent";
            }
          );
          setAttendance(newAttendance);
        } else {
          const today = new Date();
          if (selectedDate <= today) {
            const defaultAttendance: { [id: string]: "absent" } = {};
            students.forEach((s) => (defaultAttendance[s._id] = "absent"));
            setAttendance(defaultAttendance);
          } else {
            setAttendance({});
          }
        }
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setAttendance({});
      }
    };
    if (students.length > 0) {
      fetchAttendance(date);
    }
  }, [date, students, batchCode, semester]);

  const handleCalendarChange = (newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  };

  const handleRadioChange = async (id: string, value: "present" | "absent") => {
    const today = new Date();
    if (date > today) {
      alert("You cannot mark attendance for a future date.");
      return;
    }

    setLoadingIds((prev) => ({ ...prev, [id]: true }));

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: id,
          subjectName: subject?.name,
          subjectCode: subject?.code,
          date: date.toISOString(),
          isPresent: value === "present",
          sem: Number(semester),
        }),
      });

      if (!res.ok) throw new Error("Failed to update attendance");

      setAttendance((prev) => ({ ...prev, [id]: value }));
    } catch (err) {
      console.error("Attendance update error:", err);
      alert("Failed to update attendance for student.");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  if (loading)
    return <div className="text-white text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center mt-10">Error: {error}</div>;

  return (
    <div className="bg-black text-white min-h-screen p-6 space-y-8">
      <h2 className="text-3xl font-bold text-white/90 mb-6">
        📅 Attendance Entry
      </h2>

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
        <table className="min-w-full bg-gray-950 text-white text-sm rounded-md overflow-hidden border border-gray-800 shadow-sm">
          <thead className="bg-gray-800 text-gray-300 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3 border-b border-gray-700 text-left">
                Roll No
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-left">
                Name
              </th>
              <th className="px-6 py-3 border-b border-gray-700 text-center">
                Attendance
              </th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-8 text-center text-gray-400 italic border-t border-gray-800"
                >
                  No student found for this batch and subject.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr
                  key={student._id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-all"
                >
                  <td className="px-6 py-3 whitespace-nowrap">
                    {student.roll}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {student.name}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {loadingIds[student._id] ? (
                      <div className="w-5 h-5 mx-auto border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <div className="flex justify-center items-center gap-4">
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="present"
                            checked={attendance[student._id] === "present"}
                            onChange={() =>
                              handleRadioChange(student._id, "present")
                            }
                            className="accent-green-500 w-5 h-5 cursor-pointer"
                          />
                          <span className="text-green-400 text-lg">P</span>
                        </label>
                        <label className="flex items-center gap-1">
                          <input
                            type="radio"
                            name={`attendance-${student._id}`}
                            value="absent"
                            checked={attendance[student._id] === "absent"}
                            onChange={() =>
                              handleRadioChange(student._id, "absent")
                            }
                            className="accent-red-500 w-5 h-5 cursor-pointer"
                          />
                          <span className="text-red-400 text-lg">A</span>
                        </label>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

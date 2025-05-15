"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function StudentExcelUpload() {
  const [students, setStudents] = useState<any[]>([]);
  const [currSem, setCurrSem] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const parsedStudents = (jsonData as any[]).map((row, index) => {
      const roll: string =
        row["Enrollment Number"]?.toString().trim().toUpperCase() ||
        row["Enrollment No."]?.toString().trim().toUpperCase();
      const name: string =
        row["Name"]?.toString().trim() ||
        `${row["First Name"] || ""} ${row["Last Name"] || ""}`.trim();
      const email: string = row["Email"]?.toString().trim();
      const password: string =
        row["Password"]?.toString().trim() || roll?.toLowerCase();
      const batchCode = roll.substring(0, 6);
      const branchCode = roll.substring(4, 6);
      const branch = branchCode === "CS" ? "CS" : "EC";

      let section = "A1";
      const rollNum = parseInt(roll.slice(-2));
      if (branch === "CS") section = rollNum <= 30 ? "A1" : "A2";
      else if (branch === "EC") section = rollNum <= 30 ? "B1" : "B2";

      return {
        name,
        roll,
        email,
        password,
        batchCode,
        branch,
        section,
        currSem,
      };
    });

    setStudents(parsedStudents);
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);
      const res = await fetch("/api/student/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(students),
      });

      if (!res.ok) throw new Error("Upload failed");
      setSuccess(true);
      setStudents([]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold mb-2">Upload Student Excel</h1>
          <p className="text-sm text-[#737373]">
            Upload an Excel file to parse and submit student data
          </p>
        </div>

        <div className="mb-4 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="file:bg-[#1A1A1A] file:text-white file:border-none file:rounded file:px-4 file:py-2 file:cursor-pointer"
          />

          <input
            type="number"
            min={1}
            max={8}
            value={currSem}
            onChange={(e) => setCurrSem(parseInt(e.target.value))}
            placeholder="Semester"
            className="bg-[#1A1A1A] text-white border border-[#333] rounded px-4 py-2 w-32"
          />

          <button
            onClick={handleUpload}
            disabled={loading || students.length === 0}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload to API"}
          </button>
        </div>

        {success && <p className="text-green-400 mb-4">Upload successful!</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {students.length > 0 && (
          <div className="overflow-auto max-h-[500px] border border-[#2A2A2A] rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-[#1A1A1A]">
                <tr>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">#</th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Name
                  </th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Roll
                  </th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Email
                  </th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Password
                  </th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Batch Code
                  </th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Branch
                  </th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Section
                  </th>
                  <th className="text-left p-2 border-b border-[#2A2A2A]">
                    Semester
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, idx) => (
                  <tr key={idx} className="even:bg-[#1F1F1F]">
                    <td className="p-2 border-b border-[#2A2A2A]">{idx + 1}</td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.name}
                    </td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.roll}
                    </td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.email}
                    </td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.password}
                    </td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.batchCode}
                    </td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.branch}
                    </td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.section}
                    </td>
                    <td className="p-2 border-b border-[#2A2A2A]">
                      {student.currSem}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

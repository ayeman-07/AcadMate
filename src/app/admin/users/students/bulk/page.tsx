"use client";

import * as XLSX from "xlsx";
import { useState } from "react";

type Student = {
  name: string;
  roll: string;
  email: string;
  password: string;
  branch: string;
  section: string;
  currSem: number;
  batchCode: string;
};

export default function StudentUpload() {
  const [students, setStudents] = useState<Student[]>([]);
  const [branch, setBranch] = useState("CSE");
  const [section, setSection] = useState("1");
  const [currSem, setCurrSem] = useState(1);
  const [batchCode, setBatchCode] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

      const formatted: Student[] = jsonData.map((row) => ({
        name: String(row["Name"] ?? ""),
        roll: String(row["Enrollment No."] ?? "").toUpperCase(),
        email: String(row["Email"] ?? ""),
        password: String(row["Password"] ?? ""),
        branch,
        section,
        currSem,
        batchCode,
      }));

      setStudents(formatted);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/students/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ students }),
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Students uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="p-6 space-y-8 bg-black text-white min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-white/90">
        📥 Upload Student Excel
      </h2>

      {/* File Upload */}
      <label className="w-full max-w-md cursor-pointer">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition">
          <p className="text-gray-400">Click or drag your Excel file here</p>
          <p className="mt-1 text-sm text-blue-400">.xlsx only</p>
        </div>
      </label>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>

        <select
          value={section}
          onChange={(e) => setSection(e.target.value)}
          className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="1">1</option>
          <option value="2">2</option>
        </select>

        <input
          type="number"
          min={1}
          max={8}
          value={currSem}
          onChange={(e) => setCurrSem(parseInt(e.target.value))}
          placeholder="Semester"
          className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          value={batchCode}
          onChange={(e) => setBatchCode(e.target.value)}
          placeholder="Batch Code (e.g. UI24CS)"
          className="bg-gray-900 border border-gray-700 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 px-6 rounded-lg shadow-lg"
      >
        Submit
      </button>

      {/* Preview */}
      {students.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-white/90">
            🧾 Preview (first 3 students)
          </h3>
          <div className="overflow-x-auto rounded-lg border border-gray-800">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-900 text-gray-300">
                <tr>
                  {[
                    "Name",
                    "Roll",
                    "Email",
                    "Password",
                    "Branch",
                    "Section",
                    "Sem",
                    "Batch",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 border-b border-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 3).map((s: any, idx) => (
                  <tr
                    key={idx}
                    className="bg-gray-950 hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.name}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.roll}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.email}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.password}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.branch}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.section}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.currSem}
                    </td>
                    <td className="px-4 py-2 border-t border-gray-800">
                      {s.batchCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

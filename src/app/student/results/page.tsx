"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

interface ResultEntry {
  subject: {
    name: string;
    code: string;
  };
  exam: string;
  marksObtained: number;
}

export default function ResultsPage() {
  const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);
  const currentSemester = 6;
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const groupedResults: { [subjectName: string]: { [exam: string]: number } } =
    {};
  results.forEach((entry) => {
    const subjectName = entry.subject.name;
    if (!groupedResults[subjectName]) {
      groupedResults[subjectName] = {};
    }
    groupedResults[subjectName][entry.exam] = entry.marksObtained;
  });

  const fetchResults = async (sem: number) => {
    try {
      setLoading(true);
      const res = await axios.post("/api/result/student", { sem });
      setResults(res.data.results);
    } catch (error) {
      console.error("Failed to fetch results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(selectedSemester);
  }, [selectedSemester]);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text(`Results - ${semesters[selectedSemester - 1]}`, 20, 30);

    const tableColumn = ["Subject", "Quiz 1", "Midsem", "Quiz 2", "Endsem"];
    const tableRows: any[] = [];

    Object.entries(groupedResults).forEach(([subjectName, exams]) => {
      tableRows.push([
        subjectName,
        exams["quiz1"] ?? "Pending",
        exams["midsem"] ?? "Pending",
        exams["quiz2"] ?? "Pending",
        exams["endsem"] ?? "Pending",
      ]);
    });

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: {
        fontSize: 12,
      },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
    });

    pdf.save(`results_semester_${selectedSemester}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Results</h1>
        <div className="relative inline-block text-left">
          <select
            className="bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            {semesters.map((sem, idx) => (
              <option
                key={idx}
                value={idx + 1}
                className="bg-gray-800 text-white"
              >
                {sem}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400">
              <th className="py-2 px-4">Subject</th>
              <th className="py-2 px-4">Quiz 1</th>
              <th className="py-2 px-4">Midsem</th>
              <th className="py-2 px-4">Quiz 2</th>
              <th className="py-2 px-4">Endsem</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedResults).map(([subjectName, exams], idx) => (
              <tr key={idx} className="border-t border-white/10">
                <td className="py-3 px-4 font-semibold">{subjectName}</td>
                <td className="py-3 px-4">{exams["quiz1"] ?? "Pending"}</td>
                <td className="py-3 px-4">{exams["midsem"] ?? "Pending"}</td>
                <td className="py-3 px-4">{exams["quiz2"] ?? "Pending"}</td>
                <td className="py-3 px-4">{exams["endsem"] ?? "Pending"}</td>
              </tr>
            ))}
            {!Object.keys(groupedResults).length && !loading && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No results available for this semester.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
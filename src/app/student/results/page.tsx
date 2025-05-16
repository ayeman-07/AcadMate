"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SubjectResult {
  subject: {
    name: string;
    code: string;
  };
  exam: string;
  marksObtained: number;
}

interface MappedSubject {
  subject: string;
  code: string;
  credits: number;
  quiz1?: string;
  midsem?: string;
  quiz2?: string;
  endsem?: string;
  total: number;
  grade: string;
  [key: string]: string | number | undefined;
}

export default function ResultsPage() {
  const semesters = [
    "Semester 1",
    "Semester 2",
    "Semester 3",
    "Semester 4",
    "Semester 5",
    "Semester 6",
    "Semester 7",
    "Semester 8",
  ];

  const currentSemester = 6;
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);
  const [results, setResults] = useState<MappedSubject[]>([]);
  const [loading, setLoading] = useState(false);
  const [sgpa, setSGPA] = useState<number | null>(null);


  const fetchResults = async (sem: number) => {
    try {
      setLoading(true);
      const res = await fetch("/api/result/student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sem: sem.toString() }),
      });

      const data = await res.json();
      const gradeMap: Record<string, number> = {
        AA: 10,
        AB: 9,
        BB: 8,
        BC: 7,
        CC: 6,
        CD: 5,
        DD: 4,
        FF: 0,
      };
      

      const grouped: { [subjectName: string]: MappedSubject } = {};

      for (const result of data.results) {
        const subjectKey = result.subject.code;

        if (!grouped[subjectKey]) {
          grouped[subjectKey] = {
            subject: result.subject.name,
            quiz1: "0",
            midsem: "0",
            quiz2: "0",
            endsem: "0",
            total: 0,
            grade: "Pending",
            credits: result.subject.credits,
            code: result.subject.code,
          };
        }

        const examKey = result.exam as keyof MappedSubject;
        if (["quiz1", "midsem", "quiz2", "endsem"].includes(result.exam)) {
          grouped[subjectKey][examKey] = String(result.marksObtained);

        }
      }

      // After populating all exam marks, calculate total + grade
      let totalWeightedCredits = 0;
      let totalCredits = 0;

      const calculatedResults = Object.values(grouped).map((subj) => {
        const quiz1 = parseFloat(subj.quiz1 ?? "0");
        const quiz2 = parseFloat(subj.quiz2 ?? "0");
        const midsem = parseFloat(subj.midsem ?? "0");
        const endsem = parseFloat(subj.endsem ?? "0");

        const total = quiz1 + quiz2 + midsem + endsem / 2;
        let grade = "Pending";

        if (endsem < 33 || total < 36) {
          grade = "FF";
        } else if (total >= 81) grade = "AA";
        else if (total >= 71) grade = "AB";
        else if (total >= 61) grade = "BB";
        else if (total >= 53) grade = "BC";
        else if (total >= 47) grade = "CC";
        else if (total >= 42) grade = "CD";
        else if (total >= 36) grade = "DD";

        const gradeValue = gradeMap[grade] ?? 0;
        totalWeightedCredits += gradeValue * subj.credits;
        totalCredits += subj.credits;

        return { ...subj, total: Math.round(total), grade };
      });

      setResults(calculatedResults);
      setSGPA(
        totalCredits > 0
          ? parseFloat((totalWeightedCredits / totalCredits).toFixed(2))
          : null
      );

    } catch (err) {
      console.error("Failed to fetch results:", err);
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

    const tableColumn = [
      "Subject",
      "Quiz 1",
      "Midsem",
      "Quiz 2",
      "Endsem",
      "Total",
      "Grade",
    ];
    const tableRows = results.map((subj) => [
      subj.subject,
      subj.quiz1 ?? "Pending",
      subj.midsem ?? "Pending",
      subj.quiz2 ?? "Pending",
      subj.endsem ?? "Pending",
      subj.total.toString(),
      subj.grade,
    ]);


    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 12 },
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: 255,
        halign: "center",
      },
      bodyStyles: {
        halign: "center",
      },
    });
    pdf.text(`SGPA: ${sgpa ?? "N/A"}`, 20, 45);

    pdf.save(`results_semester_${selectedSemester}.pdf`);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "AA":
        return "text-green-500";
      case "AB":
        return "text-teal-400";
      case "BB":
        return "text-yellow-400";
      case "BC":
        return "text-orange-400";
      case "CC":
        return "text-amber-500";
      case "CD":
        return "text-lime-400";
      case "DD":
        return "text-lime-300";
      case "FF":
        return "text-red-500 font-bold";
      case "Pending":
      default:
        return "text-gray-400 italic";
    }
  };
  

  const getGradeRowBgColor = (grade: string) => {
    switch (grade) {
      case "AA":
        return "bg-green-700/20";
      case "AB":
        return "bg-teal-700/20";
      case "BB":
        return "bg-yellow-600/20";
      case "BC":
        return "bg-orange-500/20";
      case "CC":
        return "bg-amber-500/20";
      case "CD":
        return "bg-lime-600/20";
      case "DD":
        return "bg-lime-500/20";
      case "FF":
        return "bg-red-700/25";
      case "Pending":
      default:
        return "bg-gray-700/10";
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Results</h1>
        <div className="relative w-56 z-10">
          <select
            className="bg-gray-800 text-white border border-white/20 rounded-lg p-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(Number(e.target.value))}
          >
            {semesters.slice(0, currentSemester).map((sem, idx) => (
              <option
                key={idx}
                value={idx + 1}
                className="bg-gray-800 text-white"
              >
                {sem}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 overflow-x-auto">
        {loading ? (
          <p className="text-white/70 text-center py-10">Loading results...</p>
        ) : (
          <>
            {sgpa !== null && (
              <div className="text-lg text-white font-semibold">
                SGPA: <span className="text-indigo-400">{sgpa}</span>
              </div>
            )}

            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400">
                  <th className="py-2 px-4">Subject</th>
                  <th className="py-2 px-4">Quiz 1</th>
                  <th className="py-2 px-4">Midsem</th>
                  <th className="py-2 px-4">Quiz 2</th>
                  <th className="py-2 px-4">Endsem</th>
                  <th className="py-2 px-4">Total</th>
                  <th className="py-2 px-4">Grade</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((subject, idx) => (
                    <tr
                      key={idx}
                      className={`border-t border-white/10 ${getGradeRowBgColor(
                        subject.grade
                      )}`}
                    >
                      <td className="py-3 px-4 font-semibold">
                        {subject.subject}
                      </td>
                      <td className="py-3 px-4">
                        {subject.quiz1 ?? "Pending"}
                      </td>
                      <td className="py-3 px-4">
                        {subject.midsem ?? "Pending"}
                      </td>
                      <td className="py-3 px-4">
                        {subject.quiz2 ?? "Pending"}
                      </td>
                      <td className="py-3 px-4">
                        {subject.endsem ?? "Pending"}
                      </td>
                      <td className="py-3 px-4">{subject.total}</td>
                      <td
                        className={`py-3 px-4 ${getGradeColor(subject.grade)}`}
                      >
                        {subject.grade}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-400">
                      No results available for this semester.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        )}
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
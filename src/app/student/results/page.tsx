"use client";

declare module "jspdf" {
  interface jsPDF {
    lastAutoTable: {
      finalY: number;
    };
  }
}

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const currentSemester = 5;
  const [selectedSemester, setSelectedSemester] = useState(currentSemester);

  const resultsData: {
    [key: number]: {
      subject: string;
      quiz1: string;
      midsem: string;
      quiz2: string;
      endsem: string;
      grade: string;
    }[];
  } = {
    5: [
      {
        subject: "Operating Systems",
        quiz1: "27/30",
        midsem: "42/50",
        quiz2: "26/30",
        endsem: "Pending",
        grade: "Pending",
      },
      {
        subject: "Computer Networks",
        quiz1: "28/30",
        midsem: "44/50",
        quiz2: "29/30",
        endsem: "Pending",
        grade: "Pending",
      },
      {
        subject: "Database Systems",
        quiz1: "26/30",
        midsem: "41/50",
        quiz2: "27/30",
        endsem: "Pending",
        grade: "Pending",
      },
      {
        subject: "Software Engineering",
        quiz1: "25/30",
        midsem: "39/50",
        quiz2: "Pending",
        endsem: "Pending",
        grade: "Pending",
      },
    ],
    4: [
      {
        subject: "Data Structures",
        quiz1: "26/30",
        midsem: "43/50",
        quiz2: "27/30",
        endsem: "81/100",
        grade: "CC",
      },
      {
        subject: "Discrete Mathematics",
        quiz1: "24/30",
        midsem: "42/50",
        quiz2: "25/30",
        endsem: "79/100",
        grade: "FF",
      },
    ],
    3: [
      {
        subject: "Digital Logic Design",
        quiz1: "23/30",
        midsem: "40/50",
        quiz2: "24/30",
        endsem: "77/100",
        grade: "AB",
      },
      {
        subject: "Object Oriented Programming",
        quiz1: "27/30",
        midsem: "45/50",
        quiz2: "28/30",
        endsem: "85/100",
        grade: "AA",
      },
    ],
  };

  const sgpaData: { [key: number]: { value: string; verified: boolean } } = {
    5: { value: "Pending", verified: false },
    4: { value: "8.72", verified: true },
    3: { value: "8.55", verified: true },
  };

  const cgpaData: { [key: number]: string } = {
    5: "Pending",
    4: "8.63",
    3: "8.55",
  };

  const subjects = resultsData[selectedSemester] || [];
  const sgpaInfo = sgpaData[selectedSemester];
  const cgpaValue =
    sgpaInfo && sgpaInfo.verified ? cgpaData[selectedSemester] : "Pending";

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
      "Grade",
    ];
    const tableRows: any[] = [];

    subjects.forEach((subject) => {
      const subjectData = [
        subject.subject,
        subject.quiz1,
        subject.midsem,
        subject.quiz2,
        subject.endsem,
        subject.grade,
      ];
      tableRows.push(subjectData);
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

    pdf.setFontSize(14);
    pdf.text(
      `SGPA: ${sgpaInfo?.verified ? sgpaInfo.value : "Pending"}`,
      20,
      pdf.lastAutoTable.finalY + 20
    );
    pdf.text(`CGPA: ${cgpaValue}`, 20, pdf.lastAutoTable.finalY + 30);

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
              <option key={idx} value={idx + 1} className="bg-gray-800 text-white">
                {sem}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex gap-6 text-lg text-white/80">
        <div>
          <span className="font-semibold text-white">SGPA: </span>
          {sgpaInfo?.verified ? sgpaInfo.value : "Pending"}
        </div>
        <div>
          <span className="font-semibold text-white">CGPA: </span>
          {cgpaValue}
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
              <th className="py-2 px-4">Grade</th>
            </tr>
          </thead>
          <tbody>
            {subjects.length > 0 ? (
              subjects.map((subject, idx) => (
                <tr
                  key={idx}
                  className={`border-t border-white/10 ${getGradeRowBgColor(subject.grade)}`}
                >
                  <td className="py-3 px-4 font-semibold">{subject.subject}</td>
                  <td className="py-3 px-4">{subject.quiz1}</td>
                  <td className="py-3 px-4">{subject.midsem}</td>
                  <td className="py-3 px-4">{subject.quiz2}</td>
                  <td className="py-3 px-4">{subject.endsem}</td>
                  <td className={`py-3 px-4 ${getGradeColor(subject.grade)}`}>
                    {subject.grade}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-400">
                  No results available for this semester.
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

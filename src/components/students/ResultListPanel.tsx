"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import StudentTableSkeleton from "./StudentListSkeleton";

interface Props {
  department: string;
  semester?: string;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  roll: string;
  branch: string;
  semester: string;
  section: string;
  currSem?: string;
}

interface Subject {
  _id: string;
  code: string;
  name: string;
  dept: string;
  isPractical: boolean;
  credits: number;
}

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function StudentListPanel({ department, semester }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [semFilter, setSemFilter] = useState("");

  const isAllDepartments = department.toLowerCase() === "all";
  

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...(search && { search }),
          ...(department.toLowerCase() !== "all" && { department }),
          ...(semester &&
            department.toLowerCase() !== "all" && { sem: semester }),
          ...(department.toLowerCase() === "all" &&
            semFilter && { sem: semFilter }),
        });

        const res = await fetch(`/api/user-mgmt/student?${params.toString()}`);
        const data = await res.json();
        setStudents(data.students);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        toast.error("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [department, semester, search, semFilter, page]);

  useEffect(() => {
   
    if (!department || !semester) return;

    const fetchSubjects = async () => {
      try {
        const res = await fetch(
          `/api/subject-allotment?branch=${department}&semester=${semester[3]}`
        );
        const data = await res.json();
        if (res.ok && Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
          setSelectedSubject(data.subjects[0]?._id || "");
        } else {
          toast.error(data.error || "Failed to load subjects");
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch subject allotments");
      }
    };

    fetchSubjects();
  }, [department, semester]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-white">Student List</h2>

        {/* ✅ Subject Dropdown with Dark Theme */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="bg-zinc-900 text-white text-sm px-4 py-2 border border-white/10 rounded-lg"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.name}
            </option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or roll..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
          />
        </div>

        {/* Semester Filter (only for "all" dept) */}
        {isAllDepartments && (
          <select
            value={semFilter}
            onChange={(e) => {
              setSemFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
          >
            <option value="">All Semesters</option>
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <StudentTableSkeleton />
      ) : (
        <div className="bg-zinc-900/80 overflow-x-auto border border-white/10 rounded-lg">
          <table className="min-w-full text-sm text-left divide-y divide-white/10">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Name</th>
                <th className="px-6 py-3 whitespace-nowrap">Roll</th>
                <th className="px-6 py-3 whitespace-nowrap">Quiz 1</th>
                <th className="px-6 py-3 whitespace-nowrap">Mid Sem</th>
                <th className="px-6 py-3 whitespace-nowrap">Quiz 2</th>
                <th className="px-6 py-3 whitespace-nowrap">End Sem</th>
                <th className="px-6 py-3 whitespace-nowrap">Grade</th>
                <th className="px-6 py-3 whitespace-nowrap">CGPA</th>
              </tr>
            </thead>
            <tbody className="text-white divide-y divide-white/10">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-white/10 transition">
                  <td className="px-6 py-3">{student.name}</td>
                  <td className="px-6 py-3">{student.roll}</td>
                  <td className="px-6 py-3">0</td>
                  <td className="px-6 py-3">0</td>
                  <td className="px-6 py-3">0</td>
                  <td className="px-6 py-3">0</td>
                  <td className="px-6 py-3">0</td>
                  <td className="px-6 py-3">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-1 border rounded-full text-sm text-white disabled:opacity-50"
        >
          Prev
        </button>
        <span className="text-sm text-white/80">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-1 border rounded-full text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

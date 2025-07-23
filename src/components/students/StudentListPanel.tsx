"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import StudentTableSkeleton from "./StudentListSkeleton";

interface Props {
  department: string; // e.g., "CS" or "All"
  semester?: string; // optional
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

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default function StudentListPanel({ department, semester }: Props) {
  const router = useRouter();

  const [students, setStudents] = useState<Student[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [semFilter, setSemFilter] = useState("");

  const isAllDepartments = department.toLowerCase() === "all";

  // import { useCallback } from "react"; // Moved to top-level imports

  const fetchStudents = useCallback(async () => {
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
  }, [page, search, department, semester, semFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this student?")) return;
    try {
      await fetch(`/api/user-mgmt/student?id=${id}`, {
        method: "DELETE",
      });
      toast.success("Student deleted");
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student:", err);
      toast.error("Failed to delete student");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-semibold text-white">Student List</h2>
        <div className="flex gap-2 flex-wrap">
          <Link
            href="/admin/users/students/upload"
            className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Upload Excel
          </Link>
          <Link
            href="/admin/users/students/add"
            className="bg-green-600 hover:bg-green-700 transition text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Link>
        </div>
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

        {/* Semester Filter (only when dept === "all") */}
        {isAllDepartments && (
          <select
            value={semFilter}
            onChange={(e) => {
              setSemFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
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

      {loading ? (
        <StudentTableSkeleton />
      ) : (
        // Student Table
        <div className="bg-zinc-900/80 overflow-x-auto border border-white/10 rounded-lg">
          <table className="min-w-full text-sm text-left divide-y divide-white/10">
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Name</th>
                <th className="px-6 py-3 whitespace-nowrap">Roll</th>
                <th className="px-6 py-3 whitespace-nowrap">Branch</th>
                <th className="px-6 py-3 whitespace-nowrap">Semester</th>
                <th className="px-6 py-3 whitespace-nowrap">Section</th>
                <th className="px-6 py-3 whitespace-nowrap text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-white divide-y divide-white/10">
              {students.map((student) => (
                <tr
                  key={student._id}
                  onClick={() =>
                    router.push(
                      `/admin/users/students/${encodeURIComponent(
                        department.toLowerCase()
                      )}/${encodeURIComponent(
                        semester || semFilter || "unknown"
                      )}/${student._id}`
                    )
                  }
                  className="hover:bg-white/10 transition cursor-pointer"
                >
                  <td className="px-6 py-3">{student.name}</td>
                  <td className="px-6 py-3">{student.roll}</td>
                  <td className="px-6 py-3">{student.branch}</td>
                  <td className="px-6 py-3">
                    {student.currSem || student.semester}
                  </td>
                  <td className="px-6 py-3">{student.section}</td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // prevent row click
                        handleDelete(student._id);
                      }}
                      className="text-red-500 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-5 h-5 inline-block" />
                    </button>
                  </td>
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

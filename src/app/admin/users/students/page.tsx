"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Student {
  _id: string;
  name: string;
  email: string;
  roll: string;
  branch: string;
  semester: string;
  section: string;
  createdAt: string;
}

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roll: "",
    branch: "",
    semester: "",
    section: "",
  });
  const router = useRouter();

  const branches = ["CS", "EC"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const sections = ["1", "2"];

  const fetchStudents = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(branch && { branch }),
        ...(semester && { semester }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/user-mgmt/student?${params}`);
      if (!response.ok) throw new Error("Failed to fetch students");

      const data = await response.json();
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch students");
    } finally {
      setIsLoading(false);
    }
  }, [page, branch, semester, search]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
        const url = editingStudent
          ? `/api/user-mgmt/student?id=${editingStudent._id}`
          : "/api/user-mgmt/student";
        const method = editingStudent ? "PUT" : "POST";

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        toast.success(
          editingStudent
            ? "Student updated successfully"
            : "Student created successfully"
        );
        setIsFormOpen(false);
        setEditingStudent(null);
        setFormData({
          name: "",
          email: "",
          password: "",
          roll: "",
          branch: "",
          semester: "",
          section: "",
        });
        fetchStudents();
      } catch (error) {
        console.log(error);
        toast.error(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [editingStudent, formData, fetchStudents]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm("Are you sure you want to delete this student?")) return;

      try {
        const response = await fetch(`/api/user-mgmt/student?id=${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error);
        }

        toast.success("Student deleted successfully");
        fetchStudents();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete student"
        );
      }
    },
    [fetchStudents]
  );

  const handleEdit = useCallback((student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      password: "", // Password is not included in the response
      roll: student.roll,
      branch: student.branch,
      semester: student.semester,
      section: student.section,
    });
    setIsFormOpen(true);
  }, []);

  const handleFormDataChange = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      roll: "",
      branch: "",
      semester: "",
      section: "",
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/admin/users/students/upload")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <p>Add Students ( using excel sheet )</p>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Student
        </motion.button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">All Branches</option>
          {branches.map((br) => (
            <option key={br} value={br}>
              {br}
            </option>
          ))}
        </select>
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">All Semesters</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Roll
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Semester
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Section
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-white/5">
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.roll}</td>
                <td className="px-6 py-4">{student.branch}</td>
                <td className="px-6 py-4">{student.semester}</td>
                <td className="px-6 py-4">{student.section}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(student)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(student._id)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 text-gray-200"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg disabled:opacity-50 text-gray-200"
          >
            Next
          </button>
        </div>
        <span className="text-sm text-gray-400">
          Page {page} of {totalPages}
        </span>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-950 p-8 rounded-xl w-full max-w-md space-y-6 border border-white/10 shadow-2xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingStudent ? "Edit Student" : "Add New Student"}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleFormDataChange("name", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    handleFormDataChange("email", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-500"
                />
              </div>
              {!editingStudent && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                    value={formData.password}
                    onChange={(e) =>
                      handleFormDataChange("password", e.target.value)
                    }
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-500"
                  />
                  <p className="mt-1 text-sm text-gray-400">
                    Password must contain at least 8 characters, including
                    uppercase, lowercase, numbers, and special characters
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.roll}
                  onChange={(e) => handleFormDataChange("roll", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Branch
                </label>
                <select
                  required
                  value={formData.branch}
                  onChange={(e) =>
                    handleFormDataChange("branch", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                >
                  <option value="">Select Branch</option>
                  {branches.map((br) => (
                    <option key={br} value={br}>
                      {br}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Semester
                </label>
                <select
                  required
                  value={formData.semester}
                  onChange={(e) =>
                    handleFormDataChange("semester", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Section
                </label>
                <select
                  required
                  value={formData.section}
                  onChange={(e) =>
                    handleFormDataChange("section", e.target.value)
                  }
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white"
                >
                  <option value="">Select Section</option>
                  {sections.map((sec) => (
                    <option key={sec} value={sec}>
                      Section {sec}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-lg disabled:opacity-50 font-medium transition-colors"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

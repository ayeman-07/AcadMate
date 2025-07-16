"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Professor {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  specialization: string;
  createdAt: string;
}

export default function ProfessorManagement() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState<Professor | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    specialization: "",
  });

  const departments = ["CSE", "ECE"];
  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
  ];

  const fetchProfessors = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(department && { department }),
        ...(designation && { designation }),
        ...(search && { search }),
      });

      const response = await fetch(`/api/user-mgmt/professor?${params}`);
      if (!response.ok) throw new Error("Failed to fetch professors");

      const data = await response.json();
      setProfessors(data.professors);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch professors");
    } finally {
      setIsLoading(false);
    }
  }, [page, department, designation, search]);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingProfessor
        ? `/api/user-mgmt/professor?id=${editingProfessor._id}`
        : "/api/user-mgmt/professor";
      const method = editingProfessor ? "PUT" : "POST";

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
        editingProfessor
          ? "Professor updated successfully"
          : "Professor created successfully"
      );
      setIsFormOpen(false);
      setEditingProfessor(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        department: "",
        designation: "",
        specialization: "",
      });
      fetchProfessors();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this professor?")) return;

    try {
      const response = await fetch(`/api/user-mgmt/professor?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      toast.success("Professor deleted successfully");
      fetchProfessors();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete professor"
      );
    }
  };

  const handleEdit = (professor: Professor) => {
    setEditingProfessor(professor);
    setFormData({
      name: professor.name,
      email: professor.email,
      password: "", // Password is not included in the response
      department: professor.department,
      designation: professor.designation,
      specialization: professor.specialization,
    });
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Professor Management</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Professor
        </motion.button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-200"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept} className="bg-gray-800 text-gray-200">
              {dept}
            </option>
          ))}
        </select>
        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-200"
        >
          <option value="">All Designations</option>
          {designations.map((desig) => (
            <option key={desig} value={desig} className="bg-gray-800 text-gray-200">
              {desig}
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
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Department
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Specialization
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {professors.map((professor) => (
              <tr key={professor._id} className="hover:bg-white/5">
                <td className="px-6 py-4">{professor.name}</td>
                <td className="px-6 py-4">{professor.email}</td>
                <td className="px-6 py-4">{professor.department}</td>
                <td className="px-6 py-4">{professor.designation}</td>
                <td className="px-6 py-4">{professor.specialization}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(professor)}
                      className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(professor._id)}
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-6 rounded-lg w-full max-w-md space-y-4"
          >
            <h2 className="text-xl font-bold">
              {editingProfessor ? "Edit Professor" : "Add New Professor"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              {!editingProfessor && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <select
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-200"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept} className="bg-gray-800 text-gray-200">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Designation
                </label>
                <select
                  required
                  value={formData.designation}
                  onChange={(e) =>
                    setFormData({ ...formData, designation: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-gray-200"
                >
                  <option value="">Select Designation</option>
                  {designations.map((desig) => (
                    <option key={desig} value={desig} className="bg-gray-800 text-gray-200">
                      {desig}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Specialization
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setEditingProfessor(null);
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      department: "",
                      designation: "",
                      specialization: "",
                    });
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg"
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

"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";
import { toast } from "sonner"; // Add this
import { Skeleton } from "@/components/ui/Skeleton"; // Add your Skeleton UI component

interface Professor {
    _id: string;
    name: string;
    email: string;
    department?: string;
    designation?: string;
    subjectAllotment?: { subjectName?: string };
}

export default function ProfessorManagement() {
    const [professors, setProfessors] = useState<Professor[]>([]);
    const [loading, setLoading] = useState(false);
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [page, setPage] = useState(1);
    const router = useRouter();

    const debouncedSetSearch = useMemo(() => {
        return debounce((value: string) => {
            setSearch(value);
        }, 500);
    }, []);

    useEffect(() => {
        const fetchProfessors = async () => {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                ...(department && { department }),
                ...(designation && { designation }),
                ...(search && { search }),
            });

            const res = await fetch(`/api/user-mgmt/professor?${params}`);
            const data = await res.json();

            if (res.ok) {
                setProfessors(data.professors);
            } else {
                toast.error("Failed to fetch professors");
            }

            setLoading(false);
        };

        fetchProfessors();
    }, [department, designation, search, page]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this professor?")) return;
        const res = await fetch(`/api/user-mgmt/professor/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setProfessors((prev) => prev.filter((p) => p._id !== id));
            toast.success("Professor deleted successfully");
        } else {
            toast.error("Failed to delete professor");
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto text-zinc-100 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Professor Management</h1>
                <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href="/admin/users/professors/create"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <Plus className="w-5 h-5" />
                    Add Professor
                </motion.a>
            </div>

            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        debouncedSetSearch(e.target.value);
                    }}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-md w-full sm:w-60 placeholder-zinc-400"
                />
                <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-md"
                >
                    <option value="">All Departments</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                </select>
                <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="bg-zinc-800 border border-zinc-700 text-zinc-100 px-4 py-2 rounded-md"
                >
                    <option value="">All Designations</option>
                    <option value="Assistant Professor">
                        Assistant Professor
                    </option>
                    <option value="Associate Professor">
                        Associate Professor
                    </option>
                    <option value="Professor">Professor</option>
                </select>
            </div>

            <div className="overflow-x-auto border border-zinc-800 rounded-md shadow-md">
                <table className="min-w-full divide-y divide-zinc-800 bg-zinc-900">
                    <thead className="bg-zinc-800 text-zinc-300">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold">
                                Designation
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-semibold">
                                Delete
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-24 bg-zinc-700 rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-36 bg-zinc-700 rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-20 bg-zinc-700 rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-28 bg-zinc-700 rounded" />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Skeleton className="h-8 w-20 bg-zinc-700 rounded" />
                                    </td>
                                </tr>
                            ))
                        ) : professors.length > 0 ? (
                            professors.map((prof) => (
                                <tr
                                    key={prof._id}
                                    onClick={() =>
                                        router.push(
                                            `/admin/users/professors/${prof._id}`
                                        )
                                    }
                                    className="hover:bg-zinc-800 transition cursor-pointer"
                                >
                                    <td className="px-6 py-4">{prof.name}</td>
                                    <td className="px-6 py-4">{prof.email}</td>
                                    <td className="px-6 py-4">
                                        {prof.department}
                                    </td>
                                    <td className="px-6 py-4">
                                        {prof.designation}
                                    </td>
                                    <td
                                        className="px-6 py-4 text-center"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <button
                                            onClick={() =>
                                                handleDelete(prof._id)
                                            }
                                            className="bg-red-600/60 hover:bg-red-700/90 px-4 py-2 rounded-md text-sm font-semibold text-white w-full max-w-[100px]"
                                        >
                                            <Trash2 className="w-4 h-4 inline-block mr-1" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-4 text-center text-sm text-zinc-500"
                                >
                                    No professors found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span className="text-sm text-zinc-400">Page {page}</span>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
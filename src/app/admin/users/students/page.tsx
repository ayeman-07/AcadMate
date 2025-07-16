"use client";

import React, { useState, FC, Dispatch, SetStateAction } from "react";
import { ChevronDown, Plus, ArrowUp, Trash2, X } from "lucide-react";
import Link from "next/link";

// --- Type Definitions ---
type Batches = {
  [departmentName: string]: string[];
};

// --- Reusable Components ---

interface NewSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSemester: (semesterName: string) => boolean;
  departmentName: string;
}

const NewSemesterModal: FC<NewSemesterModalProps> = ({
  isOpen,
  onClose,
  onAddSemester,
  departmentName,
}) => {
  const [semesterName, setSemesterName] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterName.trim()) {
      setError("Semester name cannot be empty.");
      return;
    }
    const success = onAddSemester(semesterName.trim());
    if (success) {
      setSemesterName("");
      setError("");
      onClose();
    } else {
      setError(
        `Semester "${semesterName.trim()}" already exists in this department.`
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-xl shadow-2xl p-6 w-full max-w-md border border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-zinc-100">
            Add New Semester to {departmentName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="semesterName"
                className="block text-sm font-medium text-zinc-300 mb-1"
              >
                Semester Name
              </label>
              <input
                type="text"
                id="semesterName"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., Sem 2"
                autoFocus
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-300 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-800 rounded-md hover:bg-teal-700 transition-colors"
            >
              Add Semester
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---

interface SemesterCardProps {
  department: string;
  semester: string;
  onPromote: (department: string, semester: string) => void;
  onDelete: (department: string, semester: string) => void;
}

const SemesterCard: FC<SemesterCardProps> = ({
  department,
  semester,
  onPromote,
  onDelete,
}) => (
  <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex flex-col justify-between shadow-md hover:shadow-teal-900/20 hover:border-zinc-600 transition-all duration-300 cursor-pointer">
    <Link href={`/admin/users/students/${department.toLowerCase()}/${semester.toLowerCase()}`} className="flex flex-col h-full">
      <div>
        <h3 className="text-lg font-bold text-zinc-100">{semester}</h3>
        <p className="text-sm text-zinc-400">{department} Department</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={() => onPromote(department, semester)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-teal-800 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-zinc-950"
        >
          <ArrowUp className="w-4 h-4" />
          Promote
        </button>
        <button
          onClick={() => onDelete(department, semester)}
          className="p-2 text-zinc-400 bg-zinc-700 rounded-md hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-zinc-950"
          aria-label={`Delete ${semester} from ${department}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </Link>
  </div>
);

// ---

interface DepartmentSectionProps {
  title: string;
  batches: Batches;
  setBatches: Dispatch<SetStateAction<Batches>>;
}

const DepartmentSection: FC<DepartmentSectionProps> = ({
  title,
  batches,
  setBatches,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddSemester = (newSemesterName: string): boolean => {
    const departmentSemesters = batches[title] || [];
    if (
      departmentSemesters
        .map((s) => s.toLowerCase())
        .includes(newSemesterName.toLowerCase())
    ) {
      return false; // Failure: semester already exists
    }
    setBatches((prev) => ({
      ...prev,
      [title]: [...departmentSemesters, newSemesterName],
    }));
    return true; // Success
  };

  const handleDeleteSemester = (
    department: string,
    semesterToDelete: string
  ) => {
    setBatches((prev) => ({
      ...prev,
      [department]: prev[department].filter((s) => s !== semesterToDelete),
    }));
  };

  const handlePromoteSemester = (
    department: string,
    semesterToPromote: string
  ) => {
    // Placeholder for promotion logic
    console.log(`Promoting ${semesterToPromote} in ${department}.`);
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl mb-6">
      <NewSemesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSemester={handleAddSemester}
        departmentName={title}
      />
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-800/60 rounded-t-xl transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-xl font-bold text-zinc-100">{title}</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-teal-800 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-zinc-900"
          >
            <Plus className="w-4 h-4" />
            Add Semester
          </button>
          <ChevronDown
            className={`w-6 h-6 text-zinc-300 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="p-4 border-t border-zinc-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(batches[title] || []).map((semester) => (
              <SemesterCard
                key={`${title}-${semester}`}
                department={title}
                semester={semester}
                onPromote={handlePromoteSemester}
                onDelete={handleDeleteSemester}
              />
            ))}
            {(!batches[title] || batches[title].length === 0) && (
              <div className="col-span-full text-center py-8 bg-zinc-800/30 rounded-lg">
                <p className="text-zinc-400">
                  No semesters found. Click "Add Semester" to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Students Page Component ---
export default function Students() {
  const [batches, setBatches] = useState<Batches>({
    "COMPUTER SCIENCE": ["Sem 1", "Sem 3", "Sem 5", "Sem 7"],
    "ELECTRONICS & COMMUNICATION": ["Sem 1", "Sem 3", "Sem 5"],
    "FIRST YEAR (ALL)": ["Sem 1"],
  });

  return (
    <div className="bg-zinc-900/70 backdrop-blur-sm rounded-lg p-2 border-white/20 border-[1px]  z-10 lg:h-[90vh] w-full text-zinc-200 flex flex-col">
      {/* Sticky Header */}
      <header className="flex-shrink-0 border-b-4 border-white/30 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-3xl font-bold text-white">
              Manage Students
            </h1>
          </div>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {Object.keys(batches)
            .sort()
            .map((dept) => (
              <DepartmentSection
                key={dept}
                title={dept}
                batches={batches}
                setBatches={setBatches}
              />
            ))}
        </div>
      </main>
    </div>
  );
}

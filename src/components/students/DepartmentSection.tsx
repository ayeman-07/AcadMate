import React, { FC, useState, Dispatch, SetStateAction } from "react";
import { ChevronDown, Plus } from "lucide-react";
import NewSemesterModal from "@/components/students/NewSemesterModal";
import SemesterCard from "@/components/students/SemesterCard";

type Batches = {
  [departmentName: string]: string[];
};

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

export default DepartmentSection;
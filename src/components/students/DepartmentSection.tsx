import React, {
  FC,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { ChevronDown, Plus } from "lucide-react";
import NewSemesterModal from "@/components/students/NewSemesterModal";
import SemesterCard from "@/components/students/SemesterCard";

// Backend Semester shape
interface Semester {
  name: string;
  department: string;
  studentCount: number;
}

type Batches = {
  [departmentName: string]: Semester[];
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

  const onAddSemester = async (name: string, department: string) => {
    try {
      const res = await fetch("/api/sem", {
        method: "POST",
        body: JSON.stringify({ name, department }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to add semester:", errorData.error);
        return false;
      }

      const newSem: Semester = {
        name,
        department,
        studentCount: 0,
      };

      setBatches((prev) => {
        const updatedDeptList = [...(prev[title] || []), newSem];
        const updatedAllList = [...(prev["ALL"] || []), newSem];

        return {
          ...prev,
          [title]: updatedDeptList,
          ALL: updatedAllList,
        };
      });

      return true;
    } catch (err) {
      console.error("Failed to add semester:", err);
      return false;
    }
  };

  const handleDeleteSemester = (
    department: string,
    semesterToDelete: string
  ) => {
    setBatches((prev) => {
      if (department === "ALL") {
        const [actualDept, ...semParts] = semesterToDelete.split(" - ");
        const actualSem = semParts.join(" - ");

        const updatedDeptList =
          prev[actualDept]?.filter((s) => s.name !== actualSem) || [];

        const updatedAllList = prev["ALL"].filter(
          (s) => `${s.department} - ${s.name}` !== semesterToDelete
        );

        return {
          ...prev,
          [actualDept]: updatedDeptList,
          ALL: updatedAllList,
        };
      } else {
        const updatedList =
          prev[department]?.filter((s) => s.name !== semesterToDelete) || [];

        return {
          ...prev,
          [department]: updatedList,
        };
      }
    });
  };


  const deleteSemester = async (department: string, semesterName: string) => {
    try {
      let actualDept = department;
      let actualName = semesterName;

      if (department === "ALL") {
        const [dept, ...semParts] = semesterName.split(" - ");
        actualDept = dept;
        actualName = semParts.join(" - ");
      }

      const res = await fetch("/api/sem", {
        method: "DELETE",
        body: JSON.stringify({
          name: actualName,
          department: actualDept,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        handleDeleteSemester(department, semesterName);
      } else {
        console.error("Delete error:", data.error);
      }
    } catch (err) {
      console.error("Delete request failed:", err);
    }
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl shadow-sm">
      <NewSemesterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSemester={onAddSemester}
        departmentName={title}
      />

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-zinc-800/50 rounded-t-xl transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg sm:text-xl font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-4">
          {title !== "ALL" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="bg-teal-700 hover:bg-teal-600 text-white px-3 py-1.5 rounded-md text-sm flex items-center gap-2 focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              Add Semester
            </button>
          )}
          <ChevronDown
            className={`w-5 h-5 text-zinc-300 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="px-4 py-4 border-t border-zinc-800 transition-all duration-300">
          {batches[title]?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {batches[title].map((semesterObj) => (
                <SemesterCard
                  key={`${title}-${semesterObj.name}-${semesterObj.department}`}
                  department={title}
                  semester={semesterObj.name}
                  studentCount={semesterObj.studentCount}
                  actualDepartment={
                    title === "ALL" ? semesterObj.department : undefined
                  }
                  onDelete={deleteSemester}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-zinc-800/30 rounded-md">
              <p className="text-zinc-400">
                No semesters found. Click{" "}
                <span className="text-white font-medium">Add Semester</span> to
                get started.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentSection;

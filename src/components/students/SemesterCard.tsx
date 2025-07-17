import React, { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, Trash2 } from "lucide-react";

interface SemesterCardProps {
  department: string;
  semester: string;
  onDelete: (department: string, semester: string) => void;
}

const SemesterCard: FC<SemesterCardProps> = ({
  department,
  semester,
  onDelete,
}) => {
  const router = useRouter();

  // Helper to format the semester name and generate route
  const getSemesterLink = () => {
    const formattedSemester = semester.replace(/\s+/g, "").toLowerCase(); // e.g., 'Sem 3' → 'sem3'

    if (department === "ALL") {
      return `/admin/users/student/${formattedSemester}`;
    }

    const deptSlug =
      department === "COMPUTER SCIENCE"
        ? "cse"
        : department === "ELECTRONICS & COMMUNICATION"
        ? "ece"
        : department.toLowerCase().replace(/\s+/g, "-");

    return `/admin/users/student/${deptSlug}/${formattedSemester}`;
  };

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 flex flex-col justify-between shadow-md hover:shadow-teal-900/20 hover:border-zinc-600 transition-all duration-300 cursor-pointer">
      <div>
        <h3 className="text-lg font-bold text-zinc-100">{semester}</h3>
        <p className="text-sm text-zinc-400">{department} Department</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link href={getSemesterLink()}>
          <button className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-teal-800 rounded-md hover:bg-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 focus:ring-offset-zinc-950">
            Navigate
            <ArrowUp className="w-4 h-4 rotate-45" />
          </button>
        </Link>
        {department !== "ALL" && (
          <button
            onClick={() => onDelete(department, semester)}
            className="p-2 text-zinc-400 bg-zinc-700 rounded-md hover:bg-red-600 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-zinc-950"
            aria-label={`Delete ${semester} from ${department}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SemesterCard;
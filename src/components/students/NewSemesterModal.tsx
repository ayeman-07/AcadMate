interface NewSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSemester: (semesterName: string) => boolean;
  departmentName: string;
}
import { FC, useState } from "react";
import { X } from "lucide-react";

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

export default NewSemesterModal;
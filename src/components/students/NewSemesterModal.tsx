import { FC, useState } from "react";
import { X } from "lucide-react";

interface NewSemesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSemester: (name: string, department: string) => Promise<boolean>;
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
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semesterName.trim()) {
      setError("Semester name cannot be empty.");
      return;
    }

    setLoading(true);
    setError("");

    const success = await onAddSemester(semesterName.trim(), departmentName);
    setLoading(false);

    if (success) {
      setSemesterName("");
      onClose();
    } else {
      setError(
        `Semester "${semesterName.trim()}" already exists in this department.`
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 rounded-xl shadow-2xl p-6 w-full max-w-md border border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-zinc-100">
            Add New Semester to {departmentName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:bg-zinc-700 hover:text-white"
            aria-label="Close"
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
              <select
                id="semesterName"
                value={semesterName}
                onChange={(e) => setSemesterName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-600 rounded-md text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled={loading}
              >
                <option value="" disabled>
                  Select a semester
                </option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={`Sem ${i + 1}`}>
                    Sem {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-zinc-300 bg-zinc-700 rounded-md hover:bg-zinc-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-teal-800 rounded-md hover:bg-teal-700 transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Semester"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSemesterModal;

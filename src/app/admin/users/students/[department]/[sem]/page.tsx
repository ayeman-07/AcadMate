import StudentListPanel from "@/components/students/StudentListPanel";
import Link from "next/link";

export default async function StudentBatchPage({ params }: {params: Promise<{ department: string; sem: string }>}) {
  const { department, sem } = await params;
  const normalizedDept = decodeURIComponent(department).toUpperCase();
  const isValidSemester = /^[1-8]$/.test(sem[3]);

  return (
    <main className="p-6 text-zinc-100">
      {isValidSemester ? (
        <StudentListPanel department={normalizedDept} semester={sem} />
      ) : (
        <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-6">
          <p className="bg-zinc-800/60 px-8 py-4 rounded-lg text-xl font-semibold text-red-400/80 shadow-md border border-zinc-700">
            🚫 No such batch exists...
          </p>
          <Link
            href="/admin/users/students"
            className="inline-block px-6 py-2 font-semibold rounded-md bg-teal-700 hover:bg-teal-600 text-white shadow transition duration-200"
          >
            Go Back to Students
          </Link>
        </div>
      )}
    </main>
  );
}
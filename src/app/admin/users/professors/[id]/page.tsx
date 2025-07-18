import { notFound } from "next/navigation";

interface SubjectAllotment {
  subjectName: string;
  branch: string;
  section: string;
}

interface Professor {
  _id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  avatar?: string;
  phoneNumber?: string;
  subjectAllotment?: SubjectAllotment;
}

export default async function ProfessorDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let professor: Professor | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_BASE_URL}/api/user-mgmt/professor/${params.id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return notFound();

    professor = await res.json();
    console.log("Fetched professor:", professor);
  } catch (error) {
    console.error("Failed to fetch professor", error);
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-zinc-100">
      <h1 className="text-3xl font-bold mb-6">{professor?.name ?? "Not Available"}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <div>
          <p className="text-sm text-zinc-400">Email</p>
          <p className="font-medium">{professor?.email ?? "Not Available"}</p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Phone Number</p>
          <p className="font-medium">
            {professor?.phoneNumber ?? "Not Available"}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Department</p>
          <p className="font-medium">{professor?.department ?? "Not Available"}</p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Designation</p>
          <p className="font-medium">{professor?.designation ?? "Not Available"}</p>
        </div>

        {professor?.subjectAllotment && (
          <div className="sm:col-span-2 border-t border-zinc-800 pt-4 mt-2">
            <p className="text-sm text-zinc-400 mb-2 font-medium">
              Subject Allotment
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <span className="text-zinc-400">Subject:</span>{" "}
                {professor.subjectAllotment.subjectName}
              </li>
              <li>
                <span className="text-zinc-400">Branch:</span>{" "}
                {professor.subjectAllotment.branch}
              </li>
              <li>
                <span className="text-zinc-400">Section:</span>{" "}
                {professor.subjectAllotment.section}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
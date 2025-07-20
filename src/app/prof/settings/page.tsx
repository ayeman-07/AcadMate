import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authOptions";
import { connectToDB } from "@/lib/db";
import Professor from "@/models/professor/professor.model";

const getProfessor = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return "Unauthorized";
  }

  try {
    await connectToDB();

    console.log("Session user ID:", session.user.id);

    const professor = await Professor.findById(session.user.id);

    if (!professor) {
      return "Professor not found";
    }

    return professor;
  } catch (error) {
    console.error(error);
    return "Failed to fetch professor";
  }
};

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
  subjectAllotment?: SubjectAllotment[];
}



export default async function ProfessorDetailPage() {
  let professor: Professor | null = null;

  try {
    const res = await getProfessor();
    professor = res;
    if (!professor || typeof professor === "string") {
      if (professor === "Unauthorized") {
        return new Response("Unauthorized", { status: 401 });
      } else if (professor === "Professor not found") {
        return notFound();
      } else {
        console.error("Failed to fetch professor", professor);
        return notFound();
      }
    }

    console.log("Fetched professor:", professor);
  } catch (error) {
    console.error("Failed to fetch professor", error);
    return notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-6 text-zinc-100">
      <h1 className="text-3xl font-bold mb-6">
        {professor?.name ?? "Not Available"}
      </h1>

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
          <p className="font-medium">
            {professor?.department ?? "Not Available"}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-400">Designation</p>
          <p className="font-medium">
            {professor?.designation ?? "Not Available"}
          </p>
        </div>

        {professor?.subjectAllotment &&
          professor.subjectAllotment.length > 0 && (
            <div className="sm:col-span-2 border-t border-zinc-800 pt-4 mt-2">
              <p className="text-sm text-zinc-400 mb-2 font-medium">
                Subject Allotments
              </p>
              <ul className="space-y-2">
                {professor.subjectAllotment.map((subject, index) => (
                  <li
                    key={index}
                    className="bg-zinc-800 p-3 rounded-md text-sm text-zinc-300"
                  >
                    <p>
                      <span className="text-zinc-400">Subject:</span>{" "}
                      {subject.subjectName}
                    </p>
                    <p>
                      <span className="text-zinc-400">Branch:</span>{" "}
                      {subject.branch}
                    </p>
                    <p>
                      <span className="text-zinc-400">Section:</span>{" "}
                      {subject.section}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

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

export default function ProfessorDetailPage() {
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [loading, setLoading] = useState(true);
  const [editFields, setEditFields] = useState({
    name: false,
    email: false,
    phoneNumber: false,
    avatar: false,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchProfessor = async () => {
      try {
        const res = await fetch("/api/professor/me");
        if (!res.ok) {
          if (res.status === 401) return router.push("/unauthorized");
          return notFound();
        }
        const data = await res.json();
        setProfessor(data);
      } catch (err) {
        console.error("Failed to fetch professor:", err);
        return notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchProfessor();
  }, [router]);

  const handleChange = (field: keyof Professor, value: string) => {
    setProfessor((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("avatar", reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    handleChange("avatar", "");
    toast.info("Avatar removed. Don't forget to submit changes.");
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/professor/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(professor),
      });

      const isJson = res.headers.get("Content-Type")?.includes("application/json");
      const data = isJson ? await res.json() : null;

      if (!res.ok) {
        throw new Error(data?.error || res.statusText || "Update failed");
      }

      toast.success("Professor info updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update professor info");
    }
  };

  if (loading || !professor)
    return <p className="text-center mt-10 text-zinc-300">Loading...</p>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 flex justify-center">
      <div className="w-full max-w-4xl space-y-6">
        {/* Compact Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500">
            {professor.avatar ? (
              <Image
                src={professor.avatar}
                alt="Avatar"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-sm text-zinc-400">
                No Image
              </div>
            )}
          </div>

          <div>
            {editFields.avatar ? (
              <div className="space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="text-xs"
                />
                {professor.avatar && (
                  <button
                    onClick={removeAvatar}
                    className="text-red-400 text-xs flex items-center hover:underline"
                  >
                    <Trash size={14} className="mr-1" />
                    Remove
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() =>
                  setEditFields((prev) => ({ ...prev, avatar: true }))
                }
                className="text-blue-400 text-sm hover:underline"
              >
                Change Avatar
              </button>
            )}
          </div>
        </div>

        {/* Main Info Form */}
        <div className="bg-zinc-900 p-6 rounded-xl shadow-xl space-y-6">
          <h1 className="text-2xl font-bold border-b border-zinc-700 pb-2">
            Professor Info
          </h1>

          {[
            { label: "Name", key: "name" },
            { label: "Email", key: "email" },
            { label: "Phone", key: "phoneNumber" },
          ].map(({ label, key }) => (
            <div key={key} className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-sm text-zinc-400">
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() =>
                    setEditFields((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof typeof prev],
                    }))
                  }
                >
                  <Pencil size={16} />
                </button>
              </div>
              <input
                type={key === "email" ? "email" : "text"}
                disabled={!editFields[key as keyof typeof editFields]}
                className={clsx(
                  "w-full p-3 rounded-lg bg-zinc-800 text-zinc-100",
                  {
                    "opacity-60 cursor-not-allowed":
                      !editFields[key as keyof typeof editFields],
                  }
                )}
                value={
                  typeof professor[key as keyof Professor] === "string"
                    ? (professor[key as keyof Professor] as string)
                    : ""
                }
                onChange={(e) =>
                  handleChange(key as keyof Professor, e.target.value)
                }
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-4 text-sm text-zinc-400 pt-4 border-t border-zinc-700">
            <div>
              <p className="text-xs mb-1">Department</p>
              <input
                disabled
                value={professor.department}
                className="w-full p-2 rounded bg-zinc-800 text-zinc-300 cursor-not-allowed"
              />
            </div>
            <div>
              <p className="text-xs mb-1">Designation</p>
              <input
                disabled
                value={professor.designation}
                className="w-full p-2 rounded bg-zinc-800 text-zinc-300 cursor-not-allowed"
              />
            </div>
          </div>

          {(professor.subjectAllotment?.length ?? 0) > 0 && (
            <div className="pt-6 border-t border-zinc-700">
              <h2 className="text-sm font-medium text-zinc-400 mb-3">
                Subject Allotments
              </h2>
              <ul className="space-y-3">
                {(professor.subjectAllotment ?? []).map((subject, idx) => (
                  <li
                    key={idx}
                    className="bg-zinc-800 p-3 rounded-lg text-sm text-zinc-300"
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

          <div className="pt-6">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

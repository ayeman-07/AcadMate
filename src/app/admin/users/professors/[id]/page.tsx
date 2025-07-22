"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Check, Upload, Trash2, User } from "lucide-react";
import { toast } from "sonner";

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

export default function ProfessorProfilePage() {
  const router = useRouter();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState<Partial<Professor>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    fetch(`/api/user-mgmt/professor/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfessor(data);
        setDraft(data);
      })
      .catch(() => toast.error("Failed to load professor."));
  }, [params.id]);

  const handleFieldEdit = (field: keyof Professor) => {
    setIsEditing((prev) => ({ ...prev, [field]: true }));
  };

  const handleFieldSave = (field: keyof Professor) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));
  };

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setDraft((d) => ({ ...d, avatar: base64 }));
      setAvatarPreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarDelete = () => {
    setDraft((d) => ({ ...d, avatar: undefined }));
    setAvatarPreview(null);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/user-mgmt/professor/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProfessor(updated);
      setDraft(updated);
      toast.success("Professor updated!");
      router.refresh();
    } catch {
      toast.error("Failed to update professor.");
    }
  };

  if (!professor) return <div className="text-white p-6">Loading…</div>;

  const renderField = (label: string, key: keyof Professor) => (
    <div className="text-sm space-y-1">
      <span className="text-white/60 block">{label}</span>
      {isEditing[key] ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={(draft[key] as any) || ""}
            onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
            className="px-2 py-1 bg-white/5 rounded text-white flex-1"
          />
          <button
            onClick={() => {
              handleFieldSave(key);
              setProfessor((s) => ({ ...(s as any), [key]: draft[key] }));
            }}
            className="text-green-400 hover:text-green-500 p-1"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <p className="text-white">{(professor as any)[key] ?? "-"}</p>
          <button
            onClick={() => handleFieldEdit(key)}
            className="text-gray-400 hover:text-gray-500 p-1"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );

  const avatarSrc = avatarPreview || draft.avatar || professor.avatar || null;

  return (
  <div className="p-6 space-y-6 text-white">
    <h1 className="text-2xl font-bold">Professor Profile</h1>

    <div className="bg-zinc-900/80 p-6 rounded-xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Avatar Column */}
      <div className="flex flex-col items-center col-span-full md:col-span-1">
        <div className="relative w-[120px] h-[120px]">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt="avatar"
              width={120}
              height={120}
              className="rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="w-[120px] h-[120px] rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <User className="text-white/50 w-10 h-10" />
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded flex items-center gap-1">
            <Upload className="w-4 h-4" /> Change
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleAvatarChange(e.target.files[0]);
              }}
            />
          </label>

          {professor.avatar && (
            <button
              onClick={handleAvatarDelete}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>

      {/* Info Fields */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField("Name", "name")}
        {renderField("Email", "email")}
        {renderField("Phone Number", "phoneNumber")}
        {renderField("Department", "department")}
        {renderField("Designation", "designation")}
      </div>

      {/* Subject Allotments */}
      {professor.subjectAllotment && professor.subjectAllotment.length > 0 && (
        <div className="col-span-full border-t border-zinc-800 pt-4 mt-2">
          <p className="text-sm text-white/60 mb-2 font-medium">
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
                  <span className="text-zinc-400">Branch:</span> {subject.branch}
                </p>
                <p>
                  <span className="text-zinc-400">Section:</span> {subject.section}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>

    <div className="flex justify-end">
      <button
        onClick={handleSave}
        className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
      >
        Save Changes
      </button>
    </div>
  </div>
);

}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Edit, Check, Upload, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { IStudent } from "@/models/student/student.model";


export default function StudentProfilePage() {
  const router = useRouter();
  const [student, setStudent] = useState<IStudent | null>(null);
  const [isEditing, setIsEditing] = useState<Record<string, boolean>>({});
  const [draft, setDraft] = useState<Partial<IStudent>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    fetch(`/api/user-mgmt/student/${params.id}`)
      .then((r) => r.json())
      .then((d) => {
        setStudent(d.student);
        setDraft(d.student);
      })
      .catch(() => toast.error("Failed to load student."));
  }, [params.id]);

  const handleFieldEdit = (field: keyof IStudent) => {
    setIsEditing((e) => ({ ...e, [field]: true }));
  };

  const handleFieldSave = (field: keyof IStudent) => {
    setIsEditing((e) => ({ ...e, [field]: false }));
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
      const res = await fetch(`/api/user-mgmt/student/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();
      setStudent(updated.student);
      setDraft(updated.student);
      toast.success("Student updated!");
      router.refresh();
    } catch {
      toast.error("Failed to update student.");
    }
  };

  if (!student) return <div className="text-white p-6">Loading…</div>;

  const renderField = (label: string, key: keyof IStudent) => (
    <div className="text-sm space-y-1">
      <span className="text-white/60 block">{label}</span>
      {isEditing[key] ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={draft[key] !== undefined ? String(draft[key]) : ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, [key]: e.target.value }))
            }
            className="px-2 py-1 bg-white/5 rounded text-white flex-1"
          />
          <button
            onClick={() => {
              handleFieldSave(key);
              // Only update draft, student will be updated after API save
            }}
            className="text-green-400 hover:text-green-500 p-1"
            title="Save"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
            ) : (
        <div className="flex items-center gap-1">
          <p className="text-white">
            {student[key] !== undefined && student[key] !== null
              ? String(student[key])
              : "-"}
          </p>
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

  const avatarSrc = avatarPreview || draft.avatar || student.avatar || null;

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Student Profile</h1>

      <div className="bg-zinc-900/80 p-6 rounded-xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="col-span-full flex flex-col items-center">
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
                  if (e.target.files?.[0])
                    handleAvatarChange(e.target.files[0]);
                }}
              />
            </label>

            {student.avatar && (
              <button
                onClick={handleAvatarDelete}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>

          <div className="mt-4 space-y-2 text-center">
            {renderField("Name", "name")}
            {renderField("Roll Number", "roll")}
          </div>
        </div>

        {renderField("Branch", "branch")}
        {renderField("Section", "section")}
        {renderField("Semester", "currSem")}
        {renderField("Batch Code", "batchCode")}
        {renderField("Email", "email")}
        {renderField("Phone Number", "phoneNumber")}
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

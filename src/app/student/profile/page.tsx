"use client";

import React, { useEffect, useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Hash,
  BookOpen,
  Loader2,
  AlertTriangle,
} from "lucide-react";

type Student = {
  name: string;
  roll?: string;
  branch?: string;
  section?: string;
  semester?: string;
  email?: string;
  phone?: string;
  address?: string;
  image?: string;
};

export default function ProfilePage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", { method: "POST" });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to fetch profile");

        setStudent({
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
          roll: data.user.roll,
          branch: data.user.branch,
          section: data.user.section,
          semester: data.user.semester,
          phone: data.user.phone,
          address: data.user.address,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-indigo-500 w-8 h-8" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertTriangle className="w-6 h-6 mr-2" />
        {error || "Profile not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Student Profile</h1>

      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-start">
        <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-600">
            <img
              src={student.image || "/avatar-placeholder.png"}
              alt="Student Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-white text-2xl font-semibold">
              {student.name}
            </h2>
            {student.roll && (
              <p className="text-indigo-400 text-sm">{student.roll}</p>
            )}
            {student.branch && (
              <p className="text-gray-400 text-sm">{student.branch}</p>
            )}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-4">
              Academic Details
            </h3>
            <div className="space-y-3">
              {student.section && (
                <InfoItem
                  icon={<Hash className="w-5 h-5 text-indigo-400" />}
                  label="Section"
                  value={student.section}
                />
              )}
              {student.semester && (
                <InfoItem
                  icon={<BookOpen className="w-5 h-5 text-indigo-400" />}
                  label="Semester"
                  value={student.semester}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              {student.email && (
                <InfoItem
                  icon={<Mail className="w-5 h-5 text-indigo-400" />}
                  label="Email"
                  value={student.email}
                />
              )}
              {student.phone && (
                <InfoItem
                  icon={<Phone className="w-5 h-5 text-indigo-400" />}
                  label="Phone"
                  value={student.phone}
                />
              )}
              {student.address && (
                <InfoItem
                  icon={<MapPin className="w-5 h-5 text-indigo-400" />}
                  label="Address"
                  value={student.address}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="pt-1">{icon}</div>
      <div>
        <p className="text-gray-400 text-xs uppercase">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Camera, Mail, Phone, MapPin, User, Hash, BookOpen } from "lucide-react";

export default function ProfilePage() {
  const student = {
    name: "John Doe",
    roll: "CSE2023001",
    branch: "Computer Science and Engineering",
    section: "A",
    semester: "5",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    address: "123, IIIT Surat Campus, Surat, Gujarat, India",
    avatarUrl: "/avatar-placeholder.png",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Student Profile</h1>

      {/* Main Profile Section */}
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Avatar and Basic Info */}
        <div className="flex flex-col items-center gap-6 w-full lg:w-1/3">
          <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-indigo-600">
            <img
              src={student.avatarUrl}
              alt="Student Avatar"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full">
              <Camera className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-white text-2xl font-semibold">{student.name}</h2>
            <p className="text-indigo-400 text-sm">{student.roll}</p>
            <p className="text-gray-400 text-sm">{student.branch}</p>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Academic Details */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-4">Academic Details</h3>
            <div className="space-y-3">
              <InfoItem icon={<Hash className="w-5 h-5 text-indigo-400" />} label="Section" value={student.section} />
              <InfoItem icon={<BookOpen className="w-5 h-5 text-indigo-400" />} label="Semester" value={student.semester} />
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <InfoItem icon={<Mail className="w-5 h-5 text-indigo-400" />} label="Email" value={student.email} />
              <InfoItem icon={<Phone className="w-5 h-5 text-indigo-400" />} label="Phone" value={student.phone} />
              <InfoItem icon={<MapPin className="w-5 h-5 text-indigo-400" />} label="Address" value={student.address} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable small component for info rows
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

"use client";

import React, { useEffect, useState } from "react";
import DepartmentSection from "@/components/students/DepartmentSection";

type SemesterInfo = {
  name: string;
  department: string;
  studentCount: number;
};

type Batches = {
  [departmentName: string]: SemesterInfo[];
};



interface Semester {
  _id: string;
  name: string;
  department: string;
  studentCount: number;
}

export default function Students() {
  const [batches, setBatches] = useState<Batches>({
    "COMPUTER SCIENCE": [],
    "ELECTRONICS & COMMUNICATION": [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllSemesters = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/sem");
        const data: Semester[] = await res.json(); // enriched: name, department, studentCount

        const deptWise: Batches = {};
        const allList: SemesterInfo[] = [];

        data.forEach((sem) => {
          const entry = {
            name: sem.name,
            department: sem.department,
            studentCount: sem.studentCount,
          };

          if (!deptWise[sem.department]) {
            deptWise[sem.department] = [];
          }

          deptWise[sem.department].push(entry);
          allList.push(entry);
        });

        setBatches({
          ...deptWise,
        });
      } catch (error) {
        console.error("Failed to load semesters:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSemesters();
  }, []);

  return (
    <div className="bg-zinc-900/70 backdrop-blur-md rounded-xl border border-white/20 w-full h-[90vh] flex flex-col text-zinc-200 overflow-hidden">
      <header className="border-b border-white/20 px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold text-white">
          Manage Students
        </h1>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          {Object.keys(batches).map((dept) => (
            <DepartmentSection
              key={dept}
              title={dept}
              batches={batches}
              setBatches={setBatches}
              section="students"
              isLoading={isLoading}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
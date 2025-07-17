"use client";

import React, { useEffect, useState } from "react";
import DepartmentSection from "@/components/students/DepartmentSection";

type Batches = {
  [departmentName: string]: string[];
};

interface Semester {
  _id: string;
  name: string;
  department: string;
}

export default function Students() {
  const [batches, setBatches] = useState<Batches>({
    "COMPUTER SCIENCE": [],
    "ELECTRONICS & COMMUNICATION": [],
    ALL: [],
  });

  useEffect(() => {
    const fetchAllSemesters = async () => {
      try {
        const res = await fetch("/api/sem");
        const data: Semester[] = await res.json();

        const deptWise: Batches = {
          "COMPUTER SCIENCE": [],
          "ELECTRONICS & COMMUNICATION": [],
        };
        const allList: string[] = [];

        data.forEach((sem) => {
          if (!deptWise[sem.department]) {
            deptWise[sem.department] = [];
          }

          deptWise[sem.department].push(sem.name);
          allList.push(`${sem.name}`);
        });

        setBatches({
          ...deptWise,
          ALL: allList,
        });
      } catch (error) {
        console.error("Failed to load semesters:", error);
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
            />
          ))}
        </div>
      </main>
    </div>
  );
}
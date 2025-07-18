import React from "react";

const StudentTableSkeleton = () => {
  return (
    <div className="bg-zinc-900/80 overflow-x-auto border border-white/10 rounded-lg animate-pulse">
      <table className="min-w-full text-sm text-left divide-y divide-white/10">
        <thead className="bg-white/5 text-gray-300">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Roll</th>
            <th className="px-6 py-3">Branch</th>
            <th className="px-6 py-3">Semester</th>
            <th className="px-6 py-3">Section</th>
            <th className="px-6 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="text-white divide-y divide-white/10">
          {Array.from({ length: 10 }).map((_, i) => (
            <tr key={i}>
              {Array.from({ length: 6 }).map((__, j) => (
                <td key={j} className="px-6 py-4">
                  <div className="h-4 w-full bg-zinc-700 rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTableSkeleton;

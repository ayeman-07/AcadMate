"use client";

import React from "react";

const SemesterSkeletonCard = () => {
    return (
        <div className="bg-zinc-800/40 border border-zinc-700 rounded-lg p-4 animate-pulse shadow-md">
            <div className="h-5 w-3/4 bg-zinc-700 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-zinc-700 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-zinc-700 rounded mb-4"></div>

            <div className="flex gap-2 mt-4">
                <div className="h-8 w-24 bg-zinc-700 rounded-md"></div>
                <div className="h-8 w-8 bg-zinc-700 rounded-md"></div>
            </div>
        </div>
    );
};

export default SemesterSkeletonCard;
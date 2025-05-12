"use client";

import React, { useState } from "react";
import { PieChart, BarChart2, Calendar, Clipboard, BookOpen } from "lucide-react";

export default function StudentDashboard() {
  const stats = [
    { title: "Overall Attendance", value: "68%", icon: PieChart, color: "bg-blue-500" },
    { title: "Average Marks", value: "82", icon: BarChart2, color: "bg-green-500" },
    { title: "Upcoming Exams", value: "3", icon: Calendar, color: "bg-indigo-500" },
    { title: "Classes until 75%", value: "12", icon: Clipboard, color: "bg-yellow-500" },
    { title: "Current CGPA", value: "8.42", icon: BookOpen, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Heading */}
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Upcoming Exams</h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Math Midterm</span>
              <span className="text-gray-400">May 10, 2025</span>
            </li>
            <li className="flex justify-between">
              <span>Physics Quiz</span>
              <span className="text-gray-400">May 15, 2025</span>
            </li>
            <li className="flex justify-between">
              <span>History Exam</span>
              <span className="text-gray-400">May 20, 2025</span>
            </li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Attendance Shortfall</h2>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>Math</span>
              <span className="text-gray-400">4 classes</span>
            </li>
            <li className="flex justify-between">
              <span>Physics</span>
              <span className="text-gray-400">3 classes</span>
            </li>
            <li className="flex justify-between">
              <span>Chemistry</span>
              <span className="text-gray-400">5 classes</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

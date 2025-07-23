"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  BarChart2,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
// import { ExamType } from "@/components/professor/ExamSelector";
// import { StudentMarksTable } from "@/components/professor/StudentMarksTable";

// Hardcoded data for demonstration
// const sections = [
//   { id: "1", name: "Section A", semester: 3, department: "CSE" },
//   { id: "2", name: "Section B", semester: 3, department: "CSE" },
//   { id: "3", name: "Section A", semester: 5, department: "ECE" },
// ];

// const students = [
//   {
//     id: "1",
//     name: "John Doe",
//     rollNo: "CSE2023001",
//     section: "Section A",
//     semester: 3,
//     department: "CSE",
//   },
//   {
//     id: "2",
//     name: "Jane Smith",
//     rollNo: "CSE2023002",
//     section: "Section A",
//     semester: 3,
//     department: "CSE",
//   },
//   // Add more students as needed
// ];

// Mock data for demonstration
const stats = [
  {
    title: "Total Students",
    value: "120",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Pending Marks",
    value: "3",
    icon: BookOpen,
    color: "bg-yellow-500",
  },
  {
    title: "Average Results",
    value: "85%",
    icon: BarChart2,
    color: "bg-green-500",
  },
  {
    title: "Upcoming Exams",
    value: "2",
    icon: Calendar,
    color: "bg-purple-500",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "Mid Semester Results Published",
    time: "2 hours ago",
    type: "success",
  },
  {
    id: 2,
    title: "Quiz 1 Marks Entry Pending",
    time: "1 day ago",
    type: "warning",
  },
  {
    id: 3,
    title: "New Student Added",
    time: "2 days ago",
    type: "info",
  },
];

export default function DashboardOverview() {
  // const [selectedSection, setSelectedSection] = useState(sections[0].id);
  // const [selectedExam, setSelectedExam] = useState<ExamType>("quiz1");
  // const [studentMarks, setStudentMarks] = useState<Record<string, number>>({});

  // const handleMarkChange = (studentId: string, marks: number) => {
  //   setStudentMarks((prev) => ({
  //     ...prev,
  //     [studentId]: marks,
  //   }));
  // };

  // const handleSubmitMarks = () => {
  //   // Here you would typically make an API call to save the marks
  //   // console.log("Submitting marks:", {
  //   //   examType: selectedExam,
  //   //   sectionId: selectedSection,
  //   //   marks: studentMarks,
  //   // });
  //   alert("Marks submitted successfully!");
  // };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            Quick Actions
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div
                className={`${stat.color} p-3 rounded-full text-white`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/prof/marks/selection">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Enter Marks</span>
              </motion.div>
            </Link>
            <Link href="/prof/results">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <BarChart2 className="w-5 h-5 text-green-400" />
                <span>View Results</span>
              </motion.div>
            </Link>
            <Link href="/prof/students">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Users className="w-5 h-5 text-blue-400" />
                <span>Manage Students</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 p-4 bg-white/5 rounded-lg"
              >
                <AlertCircle
                  className={`w-5 h-5 ${
                    activity.type === "success"
                      ? "text-green-400"
                      : activity.type === "warning"
                      ? "text-yellow-400"
                      : "text-blue-400"
                  }`}
                />
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 
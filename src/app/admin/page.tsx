"use client";

import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Calendar,
  BookOpen,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  LucideIcon,
} from "lucide-react";

interface Stat {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  color: string;
}

interface Activity {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface Metric {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  color: string;
}

const stats: Stat[] = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    icon: Users,
    color: "bg-blue-500/20 text-blue-400",
  },
  {
    title: "Active Exams",
    value: "12",
    change: "+5%",
    icon: FileText,
    color: "bg-green-500/20 text-green-400",
  },
  {
    title: "Attendance Rate",
    value: "95%",
    change: "+2%",
    icon: Calendar,
    color: "bg-purple-500/20 text-purple-400",
  },
  {
    title: "Study Materials",
    value: "48",
    change: "+8%",
    icon: BookOpen,
    color: "bg-orange-500/20 text-orange-400",
  },
];

const recentActivities: Activity[] = [
  {
    title: "New User Registration",
    description: "John Doe registered as a student",
    time: "5 minutes ago",
    icon: Users,
    color: "text-blue-400",
  },
  {
    title: "Exam Created",
    description: "Mathematics Final Exam created",
    time: "1 hour ago",
    icon: FileText,
    color: "text-green-400",
  },
  {
    title: "Attendance Marked",
    description: "Class 10A attendance marked",
    time: "2 hours ago",
    icon: Calendar,
    color: "text-purple-400",
  },
  {
    title: "Material Uploaded",
    description: "Physics Chapter 5 notes uploaded",
    time: "3 hours ago",
    icon: BookOpen,
    color: "text-orange-400",
  },
];

const performanceMetrics: Metric[] = [
  {
    title: "Overall Performance",
    value: "92%",
    trend: "+5%",
    icon: TrendingUp,
    color: "text-green-400",
  },
  {
    title: "Pending Approvals",
    value: "8",
    trend: "-2",
    icon: AlertCircle,
    color: "text-yellow-400",
  },
  {
    title: "Completed Tasks",
    value: "24",
    trend: "+12",
    icon: CheckCircle2,
    color: "text-blue-400",
  },
  {
    title: "Average Response Time",
    value: "2.5h",
    trend: "-0.5h",
    icon: Clock,
    color: "text-purple-400",
  },
];


export default function AdminPage() {
  

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-end w-full"
      >
        <div className="text-right max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 font-montserrat tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-gray-300">
            Welcome back! Here&apos;s what&apos;s happening in your institution.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-300">
                  {stat.title}
                </p>
                <p className="text-2xl font-semibold text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-400">{stat.change}</span>
              <span className="text-sm text-gray-400 ml-1">
                from last month
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activities and Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Recent Activities
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div
                  className={`${activity.color} p-2 rounded-lg bg-opacity-10`}
                >
                  <activity.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-lg font-semibold text-white mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`${metric.color} p-2 rounded-lg bg-opacity-10`}
                  >
                    <metric.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {metric.title}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                      {metric.value}
                    </p>
                    <p className="text-sm text-green-400">{metric.trend}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

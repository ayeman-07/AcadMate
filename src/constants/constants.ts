export const roles = [
  {
    title: "Student Portal",
    description:
      "Access your courses, assignments, and track your academic progress",
    iconName: "BookOpen",
    href: "/auth/login?role=student",
    color: "bg-indigo-500",
    delay: 0.2,
  },
  {
    title: "Professor Portal",
    description:
      "Manage courses, track attendance, and evaluate student performance",
    iconName: "GraduationCap",
    href: "/auth/login?role=professor",
    color: "bg-emerald-600",
    delay: 0.4,
  },
  {
    title: "Admin Portal",
    description: "Oversee institution operations and manage system settings",
    iconName: "Building2",
    href: "/auth/login?role=admin",
    color: "bg-violet-600",
    delay: 0.6,
  },
] as const;

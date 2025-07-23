"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface RoleCardProps {
  title: string;
  description: string;
  iconName: keyof typeof Icons;
  href: string;
  color: string;
  delay: number;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export function RoleCard({
  title,
  description,
  iconName,
  href,
  color,
  delay,
}: RoleCardProps) {
  const Icon = Icons[iconName] as LucideIcon;

  return (
    <motion.div
      variants={itemVariants}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="relative"
    >
      <Link href={href}>
        <div className="group h-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-700">
          <div
            className={`${color} w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-6 transition-colors group-hover:opacity-90`}
          >
            <Icon className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <h2 className="text-xl font-medium text-slate-100 mb-3 font-montserrat tracking-tight">
            {title}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

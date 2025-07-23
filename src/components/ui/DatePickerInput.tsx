// components/ui/DatePickerInput.tsx
"use client";

import React from "react";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";

interface DatePickerInputProps {
  label: string;
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  name: string;
  required?: boolean;
}

export default function DatePickerInput({
  label,
  selectedDate,
  onChange,
  name,
  required,
}: DatePickerInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        {label}
      </label>
      <div className="relative">
        <DatePicker
          selected={selectedDate}
          onChange={onChange}
          name={name}
          required={required}
          dateFormat="yyyy-MM-dd"
          className="w-full py-2.5 px-10 text-white bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-gray-400"
          placeholderText="Select date"
        />
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      </div>
    </div>
  );
}

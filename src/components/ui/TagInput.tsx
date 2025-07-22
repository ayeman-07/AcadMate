// components/ui/TagInput.tsx
"use client";

import { X } from "lucide-react";
import React, { useState } from "react";

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  label: string;
  placeholder?: string;
}

export default function TagInput({ tags, setTags, label, placeholder }: TagInputProps) {
  const [input, setInput] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim().toUpperCase())) {
        setTags([...tags, input.trim().toUpperCase()]);
      }
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div>
      <label className="block mb-1 text-white font-medium">{label}</label>
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg">
        {tags.map((tag) => (
          <span
            key={tag}
            className="bg-indigo-600 text-white text-sm px-2 py-1 rounded flex items-center gap-1"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)}>
              <X className="w-4 h-4" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent outline-none text-white flex-1 min-w-[120px]"
        />
      </div>
    </div>
  );
}

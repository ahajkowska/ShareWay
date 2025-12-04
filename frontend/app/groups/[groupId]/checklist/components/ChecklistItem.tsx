"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { ChecklistItemDto } from "../types";

interface Props {
    item: ChecklistItemDto;
    onToggle: (itemId: string, newChecked: boolean) => void;
}

export default function ChecklistItem({ item, onToggle }: Props) {
  const [localChecked, setLocalChecked] = useState<boolean>(item.isChecked);
  const [saving, setSaving] = useState(false);

  const handleChange = async () => {
    const newChecked = !localChecked;
    setLocalChecked(newChecked);
    setSaving(true);
    try {
      await onToggle(item.id, newChecked);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.12 }}
      className={`flex items-center gap-3 p-3 rounded-xl border ${localChecked ? "bg-primary/5 border-primary/20" : "bg-background"} `}
    >
      {/* Checkbox component from your UI kit or a simple input */}
      <label className="flex items-center gap-3 w-full cursor-pointer">
        <input
          type="checkbox"
          checked={localChecked}
          onChange={handleChange}
          disabled={saving}
          className="w-5 h-5 rounded"
          aria-label={`Zaznacz ${item.text}`}
        />

        <span className={`flex-1 ${localChecked ? "line-through text-muted-foreground" : ""}`}>
          {item.text}
        </span>

        <span className="text-xs text-muted-foreground">
          {item.createdByName ? `dodane przez ${item.createdByName}` : ""}
        </span>
      </label>
    </motion.div>
  );
}
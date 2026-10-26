"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface IconActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "default" | "danger" | "active";
  type?: "button" | "submit";
}

const VARIANT_CLASSES: Record<string, string> = {
  default:
    "border-[#E8E2DD] text-[rgba(53,43,40,0.65)] hover:border-[#C58B66] hover:text-[#C58B66] hover:bg-[#C58B66]/5",
  active: "border-[#C58B66]/40 text-[#C58B66] bg-[#C58B66]/10",
  danger: "border-[#E8E2DD] text-[rgba(53,43,40,0.5)] hover:border-red-300 hover:text-red-600 hover:bg-red-50",
};

export default function IconActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  variant = "default",
  type = "button",
}: IconActionButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      whileHover={disabled ? undefined : { scale: 1.06 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors duration-200 disabled:opacity-40 disabled:pointer-events-none ${VARIANT_CLASSES[variant]}`}
    >
      <Icon size={16} strokeWidth={1.75} />
    </motion.button>
  );
}

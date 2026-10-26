import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

export default function StyledSelect({
  className = "",
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`h-9 w-full appearance-none rounded-lg border border-[#E8E2DD] bg-white pl-3 pr-9 font-sans text-sm text-[#352B28] transition-colors duration-300 hover:border-[#C58B66]/50 focus-visible:border-[#C58B66] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[#C58B66]/25 ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={15}
        strokeWidth={1.75}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(53,43,40,0.4)]"
      />
    </div>
  );
}

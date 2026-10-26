// src/components/shared/section-title.tsx
import Reveal from "./reveal";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
  light = false,
}: SectionTitleProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";
  const textColor = light ? "text-[#FAF8F6]" : "text-[#352B28]";
  const subtitleColor = light ? "text-[rgba(250,248,246,0.65)]" : "";

  return (
    <div className={`flex flex-col gap-4 ${alignClass}`}>
      {eyebrow && (
        <Reveal delay={0}>
          <p className="text-eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <h2 className={`text-section-title font-heading ${textColor}`}>{title}</h2>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className={`text-body max-w-xl ${subtitleColor} font-sans`}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}

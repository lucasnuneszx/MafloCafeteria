// src/components/shared/section-divider.tsx
interface SectionDividerProps {
  className?: string;
  opacity?: number;
}

export default function SectionDivider({ className = "", opacity = 0.3 }: SectionDividerProps) {
  return (
    <div className={`flex items-center justify-center w-full ${className}`} aria-hidden="true">
      <svg
        width="180"
        height="24"
        viewBox="0 0 180 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity }}
      >
        {/* Left line */}
        <line x1="0" y1="12" x2="68" y2="12" stroke="#C58B66" strokeWidth="0.75" />

        {/* Central floral motif */}
        <g transform="translate(90, 12)">
          {/* Center dot */}
          <circle cx="0" cy="0" r="1.5" fill="#C58B66" />
          {/* Petals */}
          <ellipse cx="0" cy="-6" rx="1.2" ry="4" fill="#C58B66" opacity="0.7" />
          <ellipse cx="0" cy="6" rx="1.2" ry="4" fill="#C58B66" opacity="0.7" />
          <ellipse cx="-6" cy="0" rx="4" ry="1.2" fill="#C58B66" opacity="0.7" />
          <ellipse cx="6" cy="0" rx="4" ry="1.2" fill="#C58B66" opacity="0.7" />
          {/* Diagonal petals */}
          <ellipse
            cx="0"
            cy="0"
            rx="1"
            ry="3.5"
            fill="#C58B66"
            opacity="0.4"
            transform="rotate(45)"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="1"
            ry="3.5"
            fill="#C58B66"
            opacity="0.4"
            transform="rotate(-45)"
          />
        </g>

        {/* Right line */}
        <line x1="112" y1="12" x2="180" y2="12" stroke="#C58B66" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

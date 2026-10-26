import Image from "next/image";

interface LogoProps {
  variant?: "dark" | "light";
  className?: string;
  height?: number;
}

export default function Logo({ variant = "dark", className = "", height = 56 }: LogoProps) {
  // Crop dimension aspect ratio is 572 / 778
  const width = Math.round(height * (572 / 778));
  const src = variant === "light" ? "/logo-white.png" : "/logo-bronze.png";

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ height, width }}>
      <Image
        src={src}
        alt="Maflô Cafeteria Conceito"
        width={width}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  );
}

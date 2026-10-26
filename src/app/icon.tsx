import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 128, height: 128 };
export const contentType = "image/png";

export default async function Icon() {
  const logoData = await readFile(join(process.cwd(), "public/logo-bronze.png"), "base64");
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#FAF8F6",
        }}
      >
        {/* Crop to the flower emblem at the top of the full logo */}
        <img
          src={logoSrc}
          width={128}
          height={128}
          style={{ objectFit: "cover", objectPosition: "top" }}
        />
      </div>
    ),
    { ...size }
  );
}

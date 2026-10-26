"use client";

import { useId, useState } from "react";

export interface BarChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface BarChartDatum {
  category: string;
  values: Record<string, number>;
}

interface BarChartProps {
  data: BarChartDatum[];
  series: BarChartSeries[];
  height?: number;
  formatValue?: (value: number) => string;
}

const TEXT_MUTED = "rgba(53,43,40,0.55)";
const TEXT_SECONDARY = "rgba(53,43,40,0.75)";
const GRID_COLOR = "rgba(53,43,40,0.08)";

export default function BarChart({ data, series, height = 220, formatValue }: BarChartProps) {
  const uid = useId();
  const [hover, setHover] = useState<{ category: string; key: string } | null>(null);

  const fmt = formatValue ?? ((v: number) => String(v));

  const maxValue = Math.max(
    1,
    ...data.flatMap((d) => series.map((s) => d.values[s.key] ?? 0))
  );

  // Round the axis ceiling to a clean step above the max.
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue || 1)));
  const niceMax = Math.ceil((maxValue * 1.15) / magnitude) * magnitude || maxValue * 1.15 || 1;

  const width = 640;
  const paddingLeft = 44;
  const paddingBottom = 28;
  const paddingTop = 12;
  const plotWidth = width - paddingLeft - 12;
  const plotHeight = height - paddingTop - paddingBottom;

  const groupWidth = plotWidth / data.length;
  const barGap = 2;
  const barThickness = Math.min(24, (groupWidth - barGap * (series.length + 1)) / series.length);

  const gridLines = 4;

  if (data.every((d) => series.every((s) => (d.values[s.key] ?? 0) === 0))) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-[#E8E2DD]"
        style={{ height }}
      >
        <p className="font-sans text-sm text-[rgba(53,43,40,0.45)]">Sem dados suficientes ainda.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {series.length > 1 && (
        <div className="flex items-center gap-4 flex-wrap">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-0.5 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="font-sans text-xs text-[rgba(53,43,40,0.6)]">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: 480 }} role="img">
          {/* Gridlines */}
          {Array.from({ length: gridLines + 1 }).map((_, i) => {
            const y = paddingTop + (plotHeight / gridLines) * i;
            const value = niceMax - (niceMax / gridLines) * i;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  x2={width - 12}
                  y1={y}
                  y2={y}
                  stroke={GRID_COLOR}
                  strokeWidth={1}
                />
                <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize={10} fill={TEXT_MUTED}>
                  {fmt(value)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, gi) => {
            const groupX = paddingLeft + gi * groupWidth;
            const innerStart = groupX + (groupWidth - series.length * barThickness - (series.length - 1) * barGap) / 2;

            return (
              <g key={`${uid}-${d.category}`}>
                {series.map((s, si) => {
                  const value = d.values[s.key] ?? 0;
                  const barHeight = (value / niceMax) * plotHeight;
                  const x = innerStart + si * (barThickness + barGap);
                  const y = paddingTop + plotHeight - barHeight;
                  const isHovered = hover?.category === d.category && hover?.key === s.key;

                  return (
                    <rect
                      key={s.key}
                      x={x}
                      y={barHeight > 0 ? y : paddingTop + plotHeight - 1}
                      width={barThickness}
                      height={Math.max(barHeight, value > 0 ? 2 : 0)}
                      rx={4}
                      fill={s.color}
                      opacity={isHovered ? 1 : 0.88}
                      onMouseEnter={() => setHover({ category: d.category, key: s.key })}
                      onMouseLeave={() => setHover(null)}
                      style={{ cursor: "pointer", transition: "opacity 150ms" }}
                    >
                      <title>
                        {d.category} · {s.label}: {fmt(value)}
                      </title>
                    </rect>
                  );
                })}
                <text
                  x={groupX + groupWidth / 2}
                  y={height - 8}
                  textAnchor="middle"
                  fontSize={10}
                  fill={TEXT_SECONDARY}
                >
                  {d.category}
                </text>
              </g>
            );
          })}
        </svg>

        {hover && (
          <div className="pointer-events-none absolute top-0 right-0 rounded-md bg-[#352B28] text-white px-2.5 py-1.5 font-sans text-xs shadow-lg">
            <span className="font-semibold">
              {fmt(data.find((d) => d.category === hover.category)?.values[hover.key] ?? 0)}
            </span>{" "}
            <span className="text-white/70">
              {series.find((s) => s.key === hover.key)?.label} · {hover.category}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

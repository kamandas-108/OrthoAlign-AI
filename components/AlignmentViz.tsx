"use client";
import { useMemo } from "react";

// Seeded pseudo-random so the points do not jump between renders.
function rng(seed: number) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

// Simple femur-like silhouette: head at top, shaft, two condyles at bottom.
function outline(): [number, number][] {
  const L: [number, number][] = [], R: [number, number][] = [];
  for (let i = 0; i <= 60; i++) {
    const y = i / 60;
    let w = 16;
    w += 26 * Math.exp(-Math.pow((y - 0.06) / 0.06, 2));
    w += 30 * Math.exp(-Math.pow((y - 0.95) / 0.09, 2));
    w += 8 * Math.exp(-Math.pow((y - 0.14) / 0.05, 2));
    const yy = 30 + y * 300;
    L.push([200 - w, yy]); R.push([200 + w, yy]);
  }
  return [...L, ...R.reverse()];
}

interface Props { progress: number; occlusionPct: number; noiseMm: number; }

export default function AlignmentViz({ progress, occlusionPct, noiseMm }: Props) {
  const base = useMemo(outline, []);
  const dots = useMemo(() => {
    const r = rng(7);
    return base.map(([x, y], i) => ({ x, y, n1: r() - 0.5, n2: r() - 0.5, keep: r(), i }));
  }, [base]);

  const off = 1 - progress;               // 1 = misaligned, 0 = aligned
  const dx = 46 * off, dy = -22 * off, rot = 14 * off;
  const occTop = 120, occH = (occlusionPct / 100) * 190; // occluded band
  const path = base.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ") + "Z";

  return (
    <svg viewBox="0 0 400 360" role="img" aria-label="CT model outline and observed surface points converging" className="w-full h-auto">
      <path d={path} fill="#DCEEF0" stroke="#0E7C86" strokeWidth={2} />
      {occlusionPct > 0 && <rect x={120} y={occTop} width={160} height={occH} fill="#C23B3B" opacity={0.12} />}
      <g transform={`translate(${dx} ${dy}) rotate(${rot} 200 180)`}>
        {dots.map((d) => {
          const hidden = d.y > occTop && d.y < occTop + occH;
          if (hidden || d.keep > 0.85) return null;
          return <circle key={d.i} cx={d.x + d.n1 * noiseMm * 3} cy={d.y + d.n2 * noiseMm * 3} r={2.6} fill="#C9821A" />;
        })}
      </g>
    </svg>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import AlignmentViz from "@/components/AlignmentViz";

const steps = [
  { t: "Build the reference", d: "Turn the pre-operative CT scan into a 3D bone model." },
  { t: "Watch the real bone", d: "A depth camera captures the exposed bone surface during surgery." },
  { t: "Find matching shapes", d: "The system picks out distinctive bone geometry that the camera can see." },
  { t: "Align the two", d: "It computes the rotation and shift that fit the CT model onto the live surface." },
  { t: "Check itself", d: "It reports error and confidence, and asks for re-registration if alignment is lost." },
];

export default function Home() {
  const [p, setP] = useState(0.15);
  const [occ, setOcc] = useState(0);
  const [noise, setNoise] = useState(0.5);
  const err = (0.4 + (1 - p) * 9 + noise * 0.8 + occ * 0.03).toFixed(1);

  return (
    <main>
      <section className="mx-auto max-w-6xl px-5 pt-14 pb-10 grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.05] tracking-tight">
            Line up the CT scan with the real bone. No pins, no markers.
          </h1>
          <p className="mt-5 text-lg text-muted max-w-prose leading-relaxed">
            Today, surgeons fix reflective arrays or pins to the bone so the computer knows where it is.
            OrthoAlign AI uses a depth camera to see the bone itself, matches it to the CT model, and tells you how much to trust the result.
          </p>
          <div className="mt-7 flex gap-3">
            <Link href="/dashboard" className="rounded-md bg-teal px-5 py-2.5 font-semibold text-white hover:bg-teal-dark">Open dashboard</Link>
            <a href="#how" className="rounded-md border border-line bg-white px-5 py-2.5 font-semibold hover:border-teal">See how it works</a>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-4">
          <AlignmentViz progress={p} occlusionPct={occ} noiseMm={noise} />
          <div className="grid gap-3 text-sm mt-2">
            <label className="grid grid-cols-[110px_1fr] items-center gap-3">Alignment
              <input type="range" min={0} max={1} step={0.01} value={p} onChange={(e) => setP(+e.target.value)} className="accent-teal" /></label>
            <label className="grid grid-cols-[110px_1fr] items-center gap-3">Occlusion
              <input type="range" min={0} max={60} step={1} value={occ} onChange={(e) => setOcc(+e.target.value)} className="accent-teal" /></label>
            <label className="grid grid-cols-[110px_1fr] items-center gap-3">Sensor noise
              <input type="range" min={0} max={3} step={0.1} value={noise} onChange={(e) => setNoise(+e.target.value)} className="accent-teal" /></label>
          </div>
          <p className="mt-3 text-sm text-muted">
            Teal is the CT model. Amber dots are what the camera sees. Surface error:{" "}
            <strong className="text-ink">{err} mm</strong>
          </p>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="font-display text-3xl font-bold tracking-tight">What the system does</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-5">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-lg border border-line bg-white p-4">
              <div className="text-sm font-semibold text-teal">Step {i + 1}</div>
              <h3 className="mt-1 font-display font-semibold">{s.t}</h3>
              <p className="mt-2 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 grid gap-6 md:grid-cols-3">
        {[
          ["Confidence you can read", "Every result shows error in mm, bone coverage, and a 0 to 1 confidence score."],
          ["Notices when it slips", "If the bone or camera moves, or too little bone is visible, the status changes and re-registration is offered."],
          ["Tested against a baseline", "Results sit next to a standard point-based method, across viewpoints, occlusion, noise and movement."],
        ].map(([t, d]) => (
          <div key={t}>
            <h3 className="font-display text-xl font-semibold">{t}</h3>
            <p className="mt-2 text-muted">{d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

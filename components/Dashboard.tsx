"use client";
import { useState } from "react";
import AlignmentViz from "./AlignmentViz";
import { runRegistration } from "@/lib/api";
import type { RegistrationResult, RegStatus, Scenario } from "@/lib/types";

const STATUS: Record<RegStatus, { label: string; cls: string }> = {
  aligned: { label: "Aligned", cls: "bg-teal-soft text-teal-dark border-teal" },
  low_confidence: { label: "Low confidence", cls: "bg-amber-soft text-amber border-amber" },
  insufficient_coverage: { label: "Not enough bone visible", cls: "bg-amber-soft text-amber border-amber" },
  lost: { label: "Alignment lost", cls: "bg-alert-soft text-alert border-alert" },
};

export default function Dashboard() {
  const [s, setS] = useState<Scenario>({ viewpoint: "anterior", occlusion_pct: 0, noise_mm: 0.5, moved: false });
  const [res, setRes] = useState<RegistrationResult | null>(null);
  const [history, setHistory] = useState<RegistrationResult[]>([]);
  const [busy, setBusy] = useState(false);

  async function run(next: Scenario = s) {
    setBusy(true);
    const r = await runRegistration(next);
    setRes(r); setHistory((h) => [r, ...h].slice(0, 8)); setBusy(false);
  }
  const reRegister = () => { const n = { ...s, moved: false }; setS(n); run(n); };

  const progress = res ? Math.max(0, Math.min(1, 1 - res.rmse_mm / 10)) : 0.1;
  const st = res ? STATUS[res.status] : null;
  const bars: [string, number, string][] = res
    ? [["Our method", res.rmse_mm, "bg-teal"], ["Baseline", res.baseline.rmse_mm, "bg-muted"]]
    : [];

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-xl border border-line bg-white p-5 h-fit grid gap-4">
        <h2 className="font-display text-xl font-semibold">Test scenario</h2>
        <label className="grid gap-1 text-sm">Camera viewpoint
          <select value={s.viewpoint} onChange={(e) => setS({ ...s, viewpoint: e.target.value as Scenario["viewpoint"] })}
            className="rounded-md border border-line px-2 py-1.5">
            <option value="anterior">Anterior</option><option value="lateral">Lateral</option><option value="oblique">Oblique</option>
          </select></label>
        <label className="grid gap-1 text-sm">Occlusion: {s.occlusion_pct}%
          <input type="range" min={0} max={60} value={s.occlusion_pct} onChange={(e) => setS({ ...s, occlusion_pct: +e.target.value })} className="accent-teal" /></label>
        <label className="grid gap-1 text-sm">Sensor noise: {s.noise_mm.toFixed(1)} mm
          <input type="range" min={0} max={3} step={0.1} value={s.noise_mm} onChange={(e) => setS({ ...s, noise_mm: +e.target.value })} className="accent-teal" /></label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={s.moved} onChange={(e) => setS({ ...s, moved: e.target.checked })} className="accent-teal" />
          Phantom was moved</label>
        <button onClick={() => run()} disabled={busy} className="rounded-md bg-teal px-4 py-2 font-semibold text-white hover:bg-teal-dark disabled:opacity-60">
          {busy ? "Registering…" : "Run registration"}</button>
      </aside>

      <section className="grid gap-6">
        {!res || !st ? (
          <div className="rounded-xl border border-dashed border-line bg-white p-10 text-center text-muted">
            No registration yet. Choose a scenario and select Run registration.
          </div>
        ) : (
          <>
            <div className={`rounded-xl border-l-4 p-4 flex flex-wrap items-center justify-between gap-3 ${st.cls}`}>
              <div>
                <div className="font-display text-xl font-semibold">{st.label}</div>
                {res.alerts.map((a) => <p key={a} className="text-sm">{a}</p>)}
              </div>
              {res.status !== "aligned" && (
                <button onClick={reRegister} className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">Re-register</button>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-line bg-white p-4">
                <AlignmentViz progress={progress} occlusionPct={s.occlusion_pct} noiseMm={s.noise_mm} />
                <p className="text-xs text-muted">Placeholder viewer. Replace with a 3D viewer (e.g. three.js) fed by the backend meshes.</p>
              </div>
              <div className="grid grid-cols-2 gap-3 content-start">
                {([
                  ["Surface error (RMSE)", `${res.rmse_mm} mm`],
                  ["Target error (TRE)", `${res.tre_mm} mm`],
                  ["Confidence", res.confidence.toFixed(2)],
                  ["Bone coverage", `${res.coverage_pct}%`],
                  ["Inlier ratio", res.inlier_ratio.toFixed(2)],
                  ["Run id", res.id],
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-line bg-white p-3">
                    <div className="text-xs text-muted">{k}</div>
                    <div className="font-display text-2xl font-semibold">{v}</div>
                  </div>
                ))}
                <div className="col-span-2 rounded-lg border border-line bg-white p-3 text-sm">
                  <div className="text-xs text-muted">Estimated transform</div>
                  Rotation (°): {res.transform.rotation_deg.join(", ")}<br />
                  Translation (mm): {res.transform.translation_mm.join(", ")}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-white p-5">
              <h3 className="font-display text-lg font-semibold">Compared with {res.baseline.method}</h3>
              {bars.map(([n, v, c]) => (
                <div key={n} className="mt-3 grid grid-cols-[90px_1fr_60px] items-center gap-3 text-sm">
                  {n}
                  <div className="h-3 rounded bg-paper"><div className={`h-3 rounded ${c}`} style={{ width: `${Math.min(100, v * 10)}%` }} /></div>
                  {v} mm
                </div>
              ))}
            </div>
          </>
        )}

        {history.length > 0 && (
          <div className="rounded-xl border border-line bg-white p-5 overflow-x-auto">
            <h3 className="font-display text-lg font-semibold mb-2">Recent runs</h3>
            <table className="w-full text-sm">
              <thead className="text-left text-muted"><tr><th>Time</th><th>Status</th><th>RMSE</th><th>TRE</th><th>Confidence</th></tr></thead>
              <tbody>{history.map((h) => (
                <tr key={h.id} className="border-t border-line">
                  <td className="py-1.5">{new Date(h.timestamp).toLocaleTimeString()}</td>
                  <td>{STATUS[h.status].label}</td><td>{h.rmse_mm} mm</td><td>{h.tre_mm} mm</td><td>{h.confidence.toFixed(2)}</td>
                </tr>))}</tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

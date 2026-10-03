import type { RegistrationResult, Scenario } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL;

// Expected backend contract (adjust with teammate):
//   POST {API}/register   body: Scenario  ->  RegistrationResult
// If NEXT_PUBLIC_API_URL is unset or the call fails, mock data is returned.
export async function runRegistration(s: Scenario): Promise<RegistrationResult> {
  if (API) {
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s),
      });
      if (res.ok) return (await res.json()) as RegistrationResult;
    } catch { /* fall through to mock */ }
  }
  return mockResult(s);
}

export function mockResult(s: Scenario): RegistrationResult {
  const coverage = Math.max(8, 78 - s.occlusion_pct * 0.9 - (s.viewpoint === "oblique" ? 6 : 0));
  const rmse = +(0.6 + s.noise_mm * 0.9 + s.occlusion_pct * 0.025 + (s.moved ? 1.8 : 0)).toFixed(2);
  const tre = +(rmse * 1.15 + (coverage < 40 ? 1.2 : 0)).toFixed(2);
  const inliers = Math.max(0.2, 0.95 - s.noise_mm * 0.12 - s.occlusion_pct / 200);
  const confidence = +Math.max(0.05, Math.min(0.99, (coverage / 100) * 0.55 + inliers * 0.55 - rmse * 0.08)).toFixed(2);
  const alerts: string[] = [];
  let status: RegistrationResult["status"] = "aligned";
  if (coverage < 35) { status = "insufficient_coverage"; alerts.push("Visible bone is too small. Move the sensor to expose more surface."); }
  else if (s.moved) { status = "lost"; alerts.push("Residual jumped after movement. Re-register."); }
  else if (confidence < 0.6) { status = "low_confidence"; alerts.push("Confidence is below 0.60. Check noise and occlusion."); }
  return {
    id: Math.random().toString(36).slice(2, 8), timestamp: new Date().toISOString(), status,
    rmse_mm: rmse, tre_mm: tre, confidence, coverage_pct: +coverage.toFixed(1), inlier_ratio: +inliers.toFixed(2),
    transform: { rotation_deg: [2.1, -1.4, 0.8], translation_mm: [3.2, -1.1, 5.6] },
    baseline: { method: "Point-based ICP", rmse_mm: +(rmse * 1.7 + 0.4).toFixed(2), tre_mm: +(tre * 1.8 + 0.5).toFixed(2) },
    alerts,
  };
}

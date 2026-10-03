export type RegStatus = "aligned" | "low_confidence" | "lost" | "insufficient_coverage";

export interface RegistrationResult {
  id: string;
  timestamp: string;
  status: RegStatus;
  rmse_mm: number;          // surface residual
  tre_mm: number;           // target registration error (phantom ground truth)
  confidence: number;       // 0..1
  coverage_pct: number;     // visible bone surface %
  inlier_ratio: number;     // 0..1
  transform: { rotation_deg: [number, number, number]; translation_mm: [number, number, number] };
  baseline: { method: string; rmse_mm: number; tre_mm: number };
  alerts: string[];
}

export interface Scenario {
  viewpoint: "anterior" | "lateral" | "oblique";
  occlusion_pct: number;
  noise_mm: number;
  moved: boolean;
}

# OrthoAlign AI (frontend)

Next.js 14 + TypeScript + Tailwind. Backend is separate (FastAPI).

    npm install
    cp .env.example .env.local
    npm run dev

Without `NEXT_PUBLIC_API_URL` the UI uses mock data from `lib/api.ts`.
Backend contract: `POST /register` with `Scenario` (lib/types.ts) returns `RegistrationResult`.
Next steps: swap `components/AlignmentViz.tsx` for a three.js viewer showing the CT mesh and observed point cloud.

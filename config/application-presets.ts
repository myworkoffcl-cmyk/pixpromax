export interface ApplicationPreset {
  id: string;
  name: string;
  country: string;
  authority: string;
  cycle: string;
  width: number;
  height: number;
  minKb?: number;
  maxKb: number;
  sourceUrl?: string;
  lastVerified: string;
  note: string;
  status: "active" | "general";
}

export const signaturePresets: ApplicationPreset[] = [
  {
    id: "ssc-selection-post-2026",
    name: "SSC signature · 2026",
    country: "India",
    authority: "Staff Selection Commission",
    cycle: "Selection Post Phase XIV, 2026",
    width: 600,
    height: 200,
    minKb: 10,
    maxKb: 20,
    sourceUrl: "https://ssc.gov.in/api/attachment/uploads/masterData/NoticeBoards/Notice_of_RHQ_2026_phase_xiv.pdf",
    lastVerified: "3 September 2026",
    note: "JPEG/JPG, 10–20 KB, approximately 6 × 2 cm. Confirm the notice for your exact application.",
    status: "active",
  },
  {
    id: "nta-ugc-net-june-2025",
    name: "NTA UGC NET signature",
    country: "India",
    authority: "National Testing Agency",
    cycle: "UGC NET June 2025 bulletin",
    width: 350,
    height: 120,
    minKb: 4,
    maxKb: 30,
    sourceUrl: "https://ugcnet.nta.ac.in/images/information-bulletin-for-ugc-net-june-2025-16042025.pdf",
    lastVerified: "3 September 2026",
    note: "The cited bulletin specifies a 4–30 KB signature. Dimensions here use a practical signature ratio; verify the current cycle.",
    status: "active",
  },
  {
    id: "general-20kb",
    name: "General · under 20 KB",
    country: "Any",
    authority: "Custom/general",
    cycle: "User selected",
    width: 400,
    height: 150,
    maxKb: 20,
    lastVerified: "Not authority-specific",
    note: "A practical starting point for portals that only specify a 20 KB maximum.",
    status: "general",
  },
];

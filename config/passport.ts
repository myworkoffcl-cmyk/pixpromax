export interface PassportPreset {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: "mm" | "in" | "px";
  dpi: number;
  backgroundRecommendation: string;
  description: string;
  authority: string;
  sourceUrl?: string;
  lastVerified: string;
  fileSize?: string;
}

export const passportPresets: PassportPreset[] = [
  { id: "india-evisa", name: "India e-Visa", width: 600, height: 600, unit: "px", dpi: 300, backgroundRecommendation: "Plain white or light background", description: "Square JPEG preparation for the Government of India e-Visa workflow.", authority: "Government of India · e-Visa", sourceUrl: "https://indianvisaonline.gov.in/visa/tvoa.html", lastVerified: "3 September 2026", fileSize: "10 KB–1 MB" },
  { id: "us-passport", name: "US passport · 2 × 2 inch", width: 2, height: 2, unit: "in", dpi: 300, backgroundRecommendation: "Plain white or off-white background", description: "Official US passport dimensions; verify head position and recency rules.", authority: "U.S. Department of State", sourceUrl: "https://travel.state.gov/content/travel/en/passports/how-apply/photos.html", lastVerified: "3 September 2026" },
  { id: "35x45", name: "General · 35 × 45 mm", width: 35, height: 45, unit: "mm", dpi: 300, backgroundRecommendation: "Plain light background", description: "A common portrait proportion; not tied to one authority.", authority: "General size guide", lastVerified: "Not authority-specific" },
  { id: "custom", name: "Custom size", width: 900, height: 900, unit: "px", dpi: 300, backgroundRecommendation: "Check the issuing authority", description: "A flexible pixel export for requirements not listed here.", authority: "User selected", lastVerified: "Not authority-specific" },
];

export type ThemePreference = "system" | "light" | "dark";

const themeOrder: readonly ThemePreference[] = ["system", "light", "dark"];

export function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && themeOrder.includes(value as ThemePreference);
}

export function nextThemePreference(theme: ThemePreference): ThemePreference {
  const index = themeOrder.indexOf(theme);
  return themeOrder[(index + 1) % themeOrder.length];
}

const RAINBOW_HUES = [0, 32, 52, 145, 205, 278] as const;

type SpectrumPeriod = "brightest" | "dusk" | "darkest" | "dawn";

type PeriodStyle = {
  saturation: number;
  lightness: number;
  opacity: number;
};

const PERIOD_STYLE: Record<SpectrumPeriod, PeriodStyle> = {
  brightest: { saturation: 72, lightness: 90, opacity: 0.2 },
  dusk: { saturation: 64, lightness: 74, opacity: 0.16 },
  darkest: { saturation: 52, lightness: 56, opacity: 0.1 },
  dawn: { saturation: 68, lightness: 82, opacity: 0.14 },
};

export type LogoSpectrum = {
  hue: number;
  nextHue: number;
  saturation: number;
  lightness: number;
  opacity: number;
  overlay: string;
  sheen: string;
};

function periodForHour(hour: number): { period: SpectrumPeriod; index: number } {
  if (hour >= 10 && hour < 16) {
    return { period: "brightest", index: hour - 10 };
  }

  if (hour >= 16 && hour < 22) {
    return { period: "dusk", index: hour - 16 };
  }

  if (hour >= 22) {
    return { period: "darkest", index: hour - 22 };
  }

  if (hour < 4) {
    return { period: "darkest", index: hour + 2 };
  }

  return { period: "dawn", index: hour - 4 };
}

export function getLogoSpectrum(date: Date = new Date()): LogoSpectrum {
  const { period, index } = periodForHour(date.getHours());
  const style = PERIOD_STYLE[period];
  const hue = RAINBOW_HUES[index];
  const nextHue = RAINBOW_HUES[(index + 1) % RAINBOW_HUES.length];

  return {
    hue,
    nextHue,
    ...style,
    overlay: `linear-gradient(115deg, hsla(${hue}, ${style.saturation}%, ${style.lightness}%, ${style.opacity}) 0%, hsla(${nextHue}, ${style.saturation}%, ${Math.min(96, style.lightness + 6)}%, ${style.opacity}) 55%, hsla(${hue}, ${style.saturation}%, ${style.lightness}%, ${style.opacity}) 100%)`,
    sheen: `radial-gradient(ellipse 70% 80% at 50% 45%, hsla(${hue}, 90%, 98%, 0.55) 0%, hsla(${hue}, ${style.saturation}%, ${style.lightness}%, 0.12) 42%, transparent 72%)`,
  };
}

export function msUntilNextHour(date: Date = new Date()) {
  const next = new Date(date);
  next.setHours(date.getHours() + 1, 0, 0, 50);
  return Math.max(1000, next.getTime() - date.getTime());
}

const navPillBase =
  "inline-flex min-h-[clamp(1.75rem,12cqi,3rem)] min-w-0 w-full items-center justify-center overflow-hidden rounded-full px-[clamp(0.08rem,0.9cqi,0.8rem)] text-[clamp(0.5rem,2.7cqi,1rem)] leading-none font-bold tracking-tight whitespace-nowrap text-white transition duration-200 hover:brightness-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background touch-manipulation";

export const navPillClassName = `${navPillBase} shadow-md ring-1 ring-white/30`;

export const navPillColors = {
  warehouse: "bg-[#F28B9C] shadow-[#F28B9C]/35 focus-visible:ring-[#F28B9C]",
  popular: "bg-[#E07A5F] shadow-[#E07A5F]/35 focus-visible:ring-[#E07A5F]",
  create: "bg-[#F0A56F] shadow-[#F0A56F]/35 focus-visible:ring-[#F0A56F]",
  stats: "bg-[#5BA4D6] shadow-[#5BA4D6]/35 focus-visible:ring-[#5BA4D6]",
  mypage: "bg-[#6DC4A8] shadow-[#6DC4A8]/35 focus-visible:ring-[#6DC4A8]",
  login: "bg-[#A78BDB] shadow-[#A78BDB]/35 focus-visible:ring-[#A78BDB]",
} as const;

export const logoutPillClassName = `${navPillBase} bg-linear-to-b from-[#e4e4e4] via-[#9a9a9a] to-[#6f6f6f] shadow-[inset_0_1px_0_rgba(255,255,255,0.75),inset_0_-2px_0_rgba(0,0,0,0.22),0_3px_0_#525252,0_6px_10px_rgba(0,0,0,0.18)] ring-1 ring-white/40 hover:brightness-105 active:translate-y-0.5 active:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(0,0,0,0.2),0_1px_0_#525252] focus-visible:ring-neutral-400`;

export function navPill(
  color: keyof typeof navPillColors,
  className = "",
) {
  return `${navPillClassName} ${navPillColors[color]} ${className}`.trim();
}

export function logoutPill(className = "") {
  return `${logoutPillClassName} ${className}`.trim();
}

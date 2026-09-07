export const siteConfig = {
  name: "HS Choice",
  tagline: "밸런스 게임 커뮤니티",
  description:
    "두 가지 선택지 중 하나를 고르는 밸런스 게임을 만들고, 투표하고, 결과를 함께 보는 커뮤니티입니다.",
  locale: "ko_KR",
  language: "ko",
  keywords: [
    "HS Choice",
    "밸런스 게임",
    "이상형 월드컵",
    "투표",
    "선택 게임",
    "커뮤니티",
  ],
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

  if (fromEnv) {
    return fromEnv;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim().replace(/\/$/, "");

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export function getSiteUrlObject() {
  return new URL(getSiteUrl());
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

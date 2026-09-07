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

function normalizeSiteUrl(value: string) {
  const trimmed = value.trim().replace(/\/$/, "");

  if (!trimmed) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  const url = new URL(withProtocol);
  const isLocal =
    url.hostname === "localhost" || url.hostname === "127.0.0.1";

  if (!isLocal) {
    url.protocol = "https:";
  }

  return url.origin;
}

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
    ? normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL)
    : "";
  const isLocalEnv =
    fromEnv.includes("localhost") || fromEnv.includes("127.0.0.1");
  const onVercel = Boolean(process.env.VERCEL);

  if (fromEnv && !(onVercel && isLocalEnv)) {
    return fromEnv;
  }

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  if (process.env.VERCEL_ENV === "production" && productionHost) {
    return `https://${productionHost}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim().replace(/\/$/, "");

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return fromEnv || "http://localhost:3000";
}

export function getSiteUrlObject() {
  return new URL(getSiteUrl());
}

export function absoluteUrl(path = "/") {
  return new URL(path, `${getSiteUrl()}/`).toString();
}

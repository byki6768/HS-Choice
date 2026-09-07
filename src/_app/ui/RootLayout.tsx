import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_KR } from "next/font/google";
import { AppProviders } from "@/_app/providers";
import { AppShell } from "@/_app/ui/AppShell";
import "@/_app/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HS Choice",
  description: "밸런스 게임 커뮤니티",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0ea" },
    { media: "(prefers-color-scheme: dark)", color: "#141210" },
  ],
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}

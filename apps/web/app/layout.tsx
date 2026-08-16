import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CanSell · 能卖哪",
  description: "Know where every product can sell — before regulations stop it.",
  icons: {
    icon: "/brand/favicon-32.png",
    apple: "/brand/apple-touch.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,520;9..144,680&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

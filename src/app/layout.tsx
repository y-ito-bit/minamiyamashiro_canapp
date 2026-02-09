import type { Metadata } from "next";
import { Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"], // Note: Zen Maru Gothic supports Japanese, but 'latin' is usually safe to load fundamentals. Next.js might warn if 'preload' is true and subsets are missing. For Japanese fonts, sometimes it's better to set preload: false if subsets are tricky, but Google Fonts usually handles it. Let's try default.
  variable: "--font-zen-maru",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Career Discovery PoC",
  description: "Discover your strengths through conversation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${zenMaru.variable} antialiased font-zen`}>
        {children}
      </body>
    </html>
  );
}

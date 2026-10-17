import type { Metadata } from "next";
import { Tajawal, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "زَتونة — حوّل فيديوهاتك لمقاطع قصيرة",
  description: "ارفع فيديو طويل، وخليه يطلعلك أقوى المقاطع جاهزة بالعربي.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${plexMono.variable}`}>
      <body className="font-arabic bg-bg bg-grain min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}

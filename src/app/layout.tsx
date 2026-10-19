import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter_Tight } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const serif = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Priscila Kaiter — Manicurista",
  description: "Manicura de autor: semipermanente, kapping, soft gel y nail art. Reservá tu turno online en segundos.",
  applicationName: "Priscila Kaiter",
  appleWebApp: { capable: true, title: "Priscila Kaiter", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    title: "Priscila Kaiter — Manicurista",
    description: "Manicura de autor. Reservá tu turno online.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable}`}>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}

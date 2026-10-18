import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope, Pinyon_Script } from "next/font/google";
import RegisterSW from "@/components/RegisterSW";
import "./globals.css";

const serif = Bodoni_Moda({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const script = Pinyon_Script({ weight: "400", subsets: ["latin"], variable: "--font-script", display: "swap" });

export const metadata: Metadata = {
  title: "Priscila Kaiter — Manicurista",
  description: "Manicura de autor: semipermanente, kapping, soft gel y nail art. Reservá tu turno online en segundos.",
  applicationName: "Priscila Kaiter",
  appleWebApp: { capable: true, title: "Priscila Kaiter", statusBarStyle: "default" },
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
  themeColor: "#FBF5EF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${serif.variable} ${sans.variable} ${script.variable}`}>
      <body>
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}

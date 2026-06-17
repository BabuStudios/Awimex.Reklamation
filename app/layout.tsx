import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Reklamationsformulär — Awimex",
  description:
    "Fyll i formuläret för att anmäla en reklamation till Awimex kundtjänst.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={spaceGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tainara & Lucas | Casamento",
    template: "%s | Tainara & Lucas",
  },
  description: "Celebre conosco o nosso casamento em 29 de dezembro de 2025.",
  keywords: ["casamento", "Tainara e Lucas", "confirmação de presença"],
  openGraph: {
    title: "Tainara & Lucas | Casamento",
    description: "Junte-se a nós na celebração do nosso casamento.",
    url: "https://www.tainaraelucas.com.br",
    siteName: "Tainara & Lucas",
    images: [
      {
        url: "https://www.tainaraelucas.com.br/og-image.png",
        width: 1200,
        height: 630,
        alt: "Convite de Casamento",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

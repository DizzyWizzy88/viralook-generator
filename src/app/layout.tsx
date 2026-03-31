import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Fixed the import path here
import "./globals.css";
import ServiceWorkerCheck from "@/components/ServiceWorkerCheck";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Viralook Generator",
  description: "Next.js + Capacitor Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServiceWorkerCheck />
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  );
}

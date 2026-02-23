import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Viralook AI Studio | AI Summoning Suite",
  description: "The ultimate AI summoning suite for viral creators.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 1. 'flex flex-col' makes the body a column 
          2. 'min-h-screen' ensures it's at least the full height of the window 
      */}
      <body className="flex flex-col min-h-screen">
        
        {/* 'flex-grow' tells the main content to take up all available space,
            pushing the footer to the bottom.
        */}
        <main className="flex-grow">
          {children}
        </main>

        {/* The Footer sits at the very end of the body */}
        <Footer />
        
      </body>
    </html>
  );
}

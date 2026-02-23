import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ backgroundColor: '#000000' }}>
      <head>
        {/* Prefetching the login page at the head level tells the browser 
          to prioritize this route's assets, making the redirect from 
          the home page feel instantaneous.
        */}
        <link rel="prefetch" href="/login" />
      </head>
      <body className="antialiased bg-black text-white selection:bg-cyan-500/30 font-sans">
        <ServiceWorkerRegistrar />
        
        <div className="relative min-h-screen overflow-x-hidden">
          {/* This background gradient matches your dashboard and login pages 
             to ensure that even during page transitions, the background 
             remains consistent and flicker-free.
          */}
          <div 
            className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,#161616_0%,#000000_100%)] -z-10" 
            aria-hidden="true"
          />
          
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}

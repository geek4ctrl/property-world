import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ErrorOverlay from "@/components/debug/ErrorOverlay";
import ComparisonBar from "@/components/property/ComparisonBar";

export const metadata: Metadata = {
  title: "Tanoluxe - Find Your Perfect Home",
  description: "Discover your dream property with Tanoluxe. Find houses, apartments, and commercial properties for sale and rent with our modern property search platform.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/house1.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/house1.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/house1.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ClientProviders>
            {children}
            <ComparisonBar />
          </ClientProviders>
        </ErrorBoundary>
        <ErrorOverlay />
      </body>
    </html>
  );
}

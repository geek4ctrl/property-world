import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ErrorOverlay from "@/components/debug/ErrorOverlay";
import ComparisonBar from "@/components/property/ComparisonBar";

export const metadata: Metadata = {
  title: "Tano - Find Your Perfect Home",
  description: "Discover your dream property with Tano. Find houses, apartments, and commercial properties for sale and rent with our modern property search platform.",
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

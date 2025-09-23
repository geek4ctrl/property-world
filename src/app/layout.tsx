import type { Metadata } from "next";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import ErrorOverlay from "@/components/debug/ErrorOverlay";
import ComparisonBar from "@/components/property/ComparisonBar";

export const metadata: Metadata = {
  title: "PropertyWorld - Find Your Perfect Home",
  description: "South Africa's leading property portal. Find houses, apartments, and commercial properties for sale and rent.",
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

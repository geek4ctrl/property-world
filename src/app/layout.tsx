import type { Metadata } from "next";
import "./globals.css";

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
      <body>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "AI Stock Wallet",
  description: "AI-powered stock wallet application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-green-50 min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  );
}

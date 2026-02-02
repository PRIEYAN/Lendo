import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navigation } from "@/components/Navigation";
import { ChainChecker } from "@/components/ChainChecker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CreditCoin Lending Circles",
  description: "Decentralized lending circle protocol on CreditCoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navigation />
          <ChainChecker />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

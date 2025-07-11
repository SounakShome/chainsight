import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Walmart ChainSight",
  description: "Advanced Supply Chain Intelligence Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} antialiased bg-[#0a0a0a] text-white min-h-screen`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}

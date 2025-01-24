import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pashu Rakshak Admin",
  description: "Admin dashboard for NGOs to manage animal rescue operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <Sidebar />
          <main className="min-h-screen pl-64 pt-16">
            <div className="container mx-auto p-6">
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}

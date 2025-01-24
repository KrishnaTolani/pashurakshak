import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: "--font-montserrat"
});

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
      <body className={`${inter.className} ${montserrat.variable}`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1">
                <div className="content-pattern min-h-full">
                  <div className="container mx-auto p-6">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}

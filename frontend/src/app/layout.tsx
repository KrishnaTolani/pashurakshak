import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Pashu Rakshak Admin Portal',
    description: 'Admin dashboard for NGOs to manage animal rescue operations',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} ${montserrat.variable}`} suppressHydrationWarning>
                <Providers>
                    <Toaster position="bottom-center" />
                    <div className="flex h-screen flex-col overflow-x-hidden">
                        <Navbar />
                        <div className="flex flex-1 overflow-hidden">
                            <Sidebar />
                            <main className="flex-1 min-w-0 overflow-auto">
                                <div className="content-pattern h-full">
                                    <div className="container mx-auto p-6">{children}</div>
                                </div>
                            </main>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}

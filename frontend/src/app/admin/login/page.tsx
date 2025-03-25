'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { setAuthToken, isAuthenticated } from '@/utils/auth';

interface ErrorResponse {
    message?: string;
    error?: string;
}

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Redirect to dashboard if already authenticated
        if (isAuthenticated()) {
            router.push('/admin/dashboard');
            return;
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await axios.post(
                `${apiUrl}/api/admin/login`,
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                const { token, user } = response.data.data;

                // Set authentication token
                setAuthToken(token);
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));

                toast.success('Login successful! Redirecting to dashboard...');

                // More reliable Next.js specific navigation pattern
                // First ensure the route is prefetched
                await router.prefetch('/admin/dashboard');

                // Use a small timeout to ensure the toast is visible
                setTimeout(() => {
                    // Use router.replace for a cleaner navigation (no history entry)
                    router.replace('/admin/dashboard');
                }, 500);
            } else {
                console.error('Login failed:', response.data.message);
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error: unknown) {
            console.error('Login error:', error);
            const axiosError = error as AxiosError<ErrorResponse>;
            toast.error(axiosError.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex items-center justify-center bg-gradient-to-br from-background via-background to-theme-nature/5 dark:from-background-dark dark:via-background-dark dark:to-theme-heart/5 p-4">
            <div className="max-w-md w-full bg-white dark:bg-card-dark rounded-2xl shadow-lg border-2 border-secondary-200 dark:border-border-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-theme-nature/20 to-transparent rounded-full blur-3xl dark:from-theme-heart/10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-theme-paw/20 to-transparent rounded-full blur-3xl dark:from-theme-nature/10" />

                <div className="relative p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">
                            Admin Login
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Sign in to access the admin dashboard
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                                placeholder="admin@pashurakshak.org"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                className="mt-1 block w-full rounded-md border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark shadow-sm focus:border-theme-nature focus:ring-theme-nature dark:focus:border-theme-heart dark:focus:ring-theme-heart transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-theme-nature to-primary-500 hover:from-theme-nature/90 hover:to-primary-600 dark:from-theme-heart dark:to-theme-paw dark:hover:from-theme-heart/90 dark:hover:to-theme-paw/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature dark:focus:ring-theme-heart transition-all duration-200 disabled:opacity-50"
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

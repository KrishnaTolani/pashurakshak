'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface LoginFormData {
    email: string;
    password: string;
}

export default function AdminLogin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const onSubmit = async (data: LoginFormData) => {
        try {
            setIsSubmitting(true);
            setError('');
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
                data
            );

            // Store the token in localStorage
            localStorage.setItem('adminToken', response.data.token);

            // Redirect to dashboard
            router.push('/admin/dashboard');
        } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            setError(axiosError.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-theme-nature/5 dark:from-background-dark dark:via-background-dark dark:to-theme-heart/5">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-card-dark rounded-2xl shadow-lg border-2 border-secondary-200 dark:border-border-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-theme-nature/20 to-transparent rounded-full blur-3xl dark:from-theme-heart/10" />

                <div className="relative">
                    <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-sm text-center text-gray-600 dark:text-gray-400">
                        Sign in to access the admin dashboard
                    </p>
                </div>

                {error && (
                    <div className="rounded-md bg-red-50 dark:bg-theme-heart/10 p-4">
                        <div className="flex">
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-theme-heart">{error}</h3>
                            </div>
                        </div>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                type="email"
                                autoComplete="email"
                                required
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^\S+@\S+\.\S+$/,
                                        message: 'Please enter a valid email',
                                    },
                                })}
                                className="appearance-none rounded-t-md relative block w-full px-3 py-2 border border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-theme-nature dark:focus:ring-theme-heart focus:border-theme-nature dark:focus:border-theme-heart focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                {...register('password', {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be at least 6 characters',
                                    },
                                })}
                                className="appearance-none rounded-b-md relative block w-full px-3 py-2 border border-secondary-300 dark:border-border-dark bg-white dark:bg-card-dark placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-theme-nature dark:focus:ring-theme-heart focus:border-theme-nature dark:focus:border-theme-heart focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-theme-nature to-primary-500 hover:from-theme-nature/90 hover:to-primary-600 dark:from-theme-heart dark:to-theme-paw dark:hover:from-theme-heart/90 dark:hover:to-theme-paw/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-nature dark:focus:ring-theme-heart transition-all duration-200 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

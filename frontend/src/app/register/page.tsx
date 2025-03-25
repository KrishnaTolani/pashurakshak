'use client';

import RegistrationForm from '@/components/ngo/RegistrationForm';
import { Toaster } from 'react-hot-toast';

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-theme-nature/5 dark:from-background-dark dark:via-background-dark dark:to-theme-heart/5 p-4">
            <div className="max-w-4xl w-full bg-white dark:bg-card-dark rounded-2xl shadow-lg border-2 border-secondary-200 dark:border-border-dark relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-theme-nature/20 to-transparent rounded-full blur-3xl dark:from-theme-heart/10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-theme-paw/20 to-transparent rounded-full blur-3xl dark:from-theme-nature/10" />

                <div className="relative p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-nature via-primary-500 to-theme-heart bg-clip-text text-transparent dark:from-theme-paw dark:via-theme-sky dark:to-theme-heart">
                            NGO Registration
                        </h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Complete the form below to register your NGO with Pashu Rakshak
                        </p>
                    </div>

                    <Toaster position="bottom-center" />
                    <RegistrationForm />
                </div>
            </div>
        </div>
    );
}

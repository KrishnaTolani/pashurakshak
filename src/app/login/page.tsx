'use client';

import { FiLock, FiMail, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (isLinkSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLinkSent, timeLeft]);

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll add the actual magic link sending logic later
    setIsLinkSent(true);
  };

  const handleResendLink = () => {
    setTimeLeft(60);
    // Here we'll add the actual resend logic later
  };

  if (showForgotPassword) {
    return (
      <div className="h-[calc(100vh-6rem)] -my-6 flex items-center justify-center">
        <div className="w-full max-w-md relative">
          {/* Background Effects */}
          <div className="absolute -top-12 -right-8 w-32 h-32 bg-gradient-to-br from-theme-nature/20 to-transparent rounded-full blur-3xl dark:from-theme-heart/10" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-gradient-to-br from-theme-paw/20 to-transparent rounded-full blur-3xl dark:from-theme-paw/10" />
          
          {/* Forgot Password Card */}
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-nature via-theme-paw to-theme-heart rounded-2xl blur opacity-20 dark:from-theme-heart dark:via-theme-paw dark:to-theme-nature" />
            <div className="card relative bg-white/80 backdrop-blur-sm dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90 p-8">
              {isLinkSent ? (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-foreground dark:text-foreground-dark mb-4">Check Your Email</h2>
                  <p className="text-muted-foreground dark:text-foreground-dark/60 mb-6">
                    We&apos;ve sent a magic link to <strong>{forgotEmail}</strong>. Please check your inbox and click the link to reset your password.
                  </p>
                  <div className="space-y-4">
                    {timeLeft > 0 ? (
                      <p className="text-sm text-muted-foreground dark:text-foreground-dark/60">
                        Resend link in {timeLeft} seconds
                      </p>
                    ) : (
                      <button
                        onClick={handleResendLink}
                        className="text-primary-600 hover:text-primary-500 dark:text-theme-heart dark:hover:text-theme-heart/80 font-medium text-sm"
                      >
                        Resend magic link
                      </button>
                    )}
                    <div>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setIsLinkSent(false);
                          setForgotEmail('');
                        }}
                        className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-500 dark:text-theme-heart dark:hover:text-theme-heart/80 font-medium"
                      >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Login
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-nature via-theme-paw to-theme-heart bg-clip-text text-transparent">
                      Reset Password
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground dark:text-foreground-dark/60">
                      Enter your email address and we&apos;ll send you a magic link to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleForgotSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground dark:text-foreground-dark">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-muted-foreground dark:text-foreground-dark/60" />
                        </div>
                        <input
                          id="forgot-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="block w-full pl-10 rounded-lg border-0 bg-white/50 dark:bg-card-dark/50 py-2 text-foreground dark:text-foreground-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-muted-foreground/60 dark:placeholder:text-foreground-dark/40 focus:ring-2 focus:ring-inset focus:ring-theme-heart dark:focus:ring-theme-heart/70 transition-all duration-200"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground dark:text-foreground-dark hover:bg-gray-50 dark:hover:bg-card-dark/50 transition-all duration-200 font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-500 dark:bg-theme-heart dark:hover:bg-theme-heart/90 transition-all duration-200 font-medium ring-1 ring-primary-600/50 dark:ring-theme-heart/50"
                      >
                        Send Link
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] -my-6 flex items-center justify-center">
      <div className="w-full max-w-md relative">
        {/* Background Effects */}
        <div className="absolute -top-12 -right-8 w-32 h-32 bg-gradient-to-br from-theme-nature/20 to-transparent rounded-full blur-3xl dark:from-theme-heart/10" />
        <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-gradient-to-br from-theme-paw/20 to-transparent rounded-full blur-3xl dark:from-theme-paw/10" />
        
        {/* Login Card */}
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-theme-nature via-theme-paw to-theme-heart rounded-2xl blur opacity-20 dark:from-theme-heart dark:via-theme-paw dark:to-theme-nature" />
          <div className="card relative bg-white/80 backdrop-blur-sm dark:bg-gradient-to-br dark:from-card-dark dark:to-card-dark/90 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-theme-nature via-theme-paw to-theme-heart bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-muted-foreground dark:text-foreground-dark/60">
                Sign in to continue to Pashurakshak
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-foreground-dark">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-muted-foreground dark:text-foreground-dark/60" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 rounded-lg border-0 bg-white/50 dark:bg-card-dark/50 py-2 text-foreground dark:text-foreground-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-muted-foreground/60 dark:placeholder:text-foreground-dark/40 focus:ring-2 focus:ring-inset focus:ring-theme-heart dark:focus:ring-theme-heart/70 transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground dark:text-foreground-dark">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-muted-foreground dark:text-foreground-dark/60" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className="block w-full pl-10 pr-10 rounded-lg border-0 bg-white/50 dark:bg-card-dark/50 py-2 text-foreground dark:text-foreground-dark shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-muted-foreground/60 dark:placeholder:text-foreground-dark/40 focus:ring-2 focus:ring-inset focus:ring-theme-heart dark:focus:ring-theme-heart/70 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground dark:text-foreground-dark/60 hover:text-foreground dark:hover:text-foreground-dark transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-theme-heart focus:ring-theme-heart dark:focus:ring-theme-heart/70"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground dark:text-foreground-dark/60">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-theme-heart dark:hover:text-theme-heart/80"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-500 dark:bg-theme-heart dark:hover:bg-theme-heart/90 transition-all duration-200 font-medium ring-1 ring-primary-600/50 dark:ring-theme-heart/50"
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-muted-foreground dark:text-foreground-dark/60">
              First time here?&nbsp;
              <Link 
                href="/register" 
                prefetch={true}
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-theme-heart dark:hover:text-theme-heart/80"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
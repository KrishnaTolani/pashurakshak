import Link from 'next/link';
import { FiAlertTriangle, FiClock, FiSearch } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-7rem)] p-8 relative z-0">
            <div className="relative max-w-3xl w-full">
                <div className="relative p-8 bg-white dark:bg-card-dark rounded-2xl border-2 border-primary-200/80 dark:border-theme-heart/10 shadow-xl backdrop-blur-sm">
                    <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-theme-nature to-theme-heart dark:from-theme-heart dark:to-theme-heart text-white rounded-full shadow-lg shadow-theme-heart/20">
                            <FiAlertTriangle className="w-5 h-5" />
                            <span className="font-medium tracking-wider">RESCUE STATUS</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-8">
                        <div className="flex items-baseline justify-between border-b border-dashed border-primary-200 dark:border-theme-heart/20 pb-4">
                            <span className="text-sm text-muted-foreground/80 dark:text-foreground-dark/60">
                                Mission ID:
                            </span>
                            <span className="font-mono text-xl font-bold bg-gradient-to-r from-primary-600 to-theme-heart dark:from-theme-nature dark:to-theme-heart bg-clip-text text-transparent">
                                404_PAGE_NOT_FOUND
                            </span>
                        </div>

                        <div className="relative">
                            <div className="text-center space-y-2">
                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary-50 dark:bg-theme-heart/5 rounded-lg border border-primary-100 dark:border-theme-heart/10">
                                    <FiClock className="w-5 h-5 text-primary-600 dark:text-theme-heart animate-spin" />
                                    <span className="text-sm font-medium text-primary-600 dark:text-theme-heart">
                                        Search in Progress
                                    </span>
                                </div>
                                <h1 className="text-7xl font-black tracking-tighter">
                                    <span className="bg-gradient-to-r from-primary-600 to-theme-paw dark:from-theme-nature dark:to-theme-paw bg-clip-text text-transparent">
                                        4
                                    </span>
                                    <span className="relative mx-2 text-theme-heart animate-pulse">
                                        0
                                    </span>
                                    <span className="bg-gradient-to-r from-theme-paw to-theme-heart bg-clip-text text-transparent">
                                        4
                                    </span>
                                </h1>
                            </div>
                        </div>

                        <div className="space-y-4 font-mono text-sm">
                            <div className="p-4 bg-primary-50/50 dark:bg-white/5 rounded-lg border border-primary-100/50 dark:border-theme-heart/10">
                                <p className="text-primary-700/90 dark:text-foreground-dark/60">
                                    <span className="text-theme-heart font-semibold">[ERROR]</span>{' '}
                                    Page location unknown
                                </p>
                                <p className="text-primary-700/90 dark:text-foreground-dark/60">
                                    <span className="text-primary-600 dark:text-theme-paw font-semibold">
                                        [STATUS]
                                    </span>{' '}
                                    Search party deployed
                                </p>
                                <p className="text-primary-700/90 dark:text-foreground-dark/60">
                                    <span className="text-theme-nature font-semibold">
                                        [UPDATE]
                                    </span>{' '}
                                    Still searching...
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4 pt-4 border-t border-dashed border-primary-200 dark:border-theme-heart/20">
                            <p className="text-lg font-medium text-foreground/90 dark:text-foreground-dark">
                                Recommended Action:
                            </p>
                            <Link
                                href="/"
                                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-600 to-theme-heart hover:from-theme-heart hover:to-primary-600 dark:from-theme-nature dark:to-theme-heart dark:hover:from-theme-heart dark:hover:to-theme-nature text-white rounded-xl transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/20 dark:hover:shadow-theme-heart/20"
                            >
                                <FiSearch className="w-5 h-5" />
                                <span className="font-medium">Return to Base</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute -z-10 inset-0 blur-3xl pointer-events-none">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-primary-200/50 dark:bg-theme-nature/10 rounded-full" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-theme-heart/30 dark:bg-theme-heart/10 rounded-full" />
                </div>
            </div>
        </div>
    );
}

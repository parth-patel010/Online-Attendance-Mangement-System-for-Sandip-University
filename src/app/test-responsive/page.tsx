'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function ResponsiveTestPage() {
    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Logo and Header */}
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Image
                            src="/logo.png"
                            alt="Sandip University Logo"
                            width={48}
                            height={48}
                            className="w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-md"
                        />
                        <div className="flex flex-col">
                            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 tracking-wider">SANDIP</h1>
                            <div className="w-16 sm:w-20 lg:w-24 h-0.5 bg-yellow-500 mb-1"></div>
                            <p className="text-xs sm:text-sm text-slate-600 tracking-wider">UNIVERSITY</p>
                            <p className="text-xs text-gray-500">(UGC Recognized)</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="text-center sm:text-right">
                            <p className="text-xs sm:text-sm text-slate-600">Responsive Test</p>
                            <p className="text-sm sm:text-base font-medium text-slate-900">Mobile-First Design</p>
                        </div>
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            size="sm"
                            className="border-slate-200 text-slate-700 hover:bg-slate-100 w-full sm:w-auto"
                        >
                            Back to Home
                        </Button>
                    </div>
                </motion.div>

                <motion.h2
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-blue-600 px-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Responsive Design Test
                </motion.h2>

                <motion.p
                    className="text-center text-base sm:text-lg text-slate-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    This page demonstrates the responsive design features implemented across the entire website.
                    Test on different screen sizes to see the mobile-first approach in action.
                </motion.p>

                {/* Responsive Grid Test */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <Card className="bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg sm:text-xl text-center text-blue-600">📱 Mobile</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center pt-0">
                                <p className="text-sm sm:text-base text-slate-600 mb-4">
                                    Optimized for phones and small tablets with touch-friendly interfaces
                                </p>
                                <div className="text-xs sm:text-sm text-slate-500 space-y-1">
                                    <p>• Responsive text sizing</p>
                                    <p>• Touch-friendly buttons</p>
                                    <p>• Stacked layouts</p>
                                    <p>• Optimized spacing</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <Card className="bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg sm:text-xl text-center text-green-600">💻 Tablet</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center pt-0">
                                <p className="text-sm sm:text-base text-slate-600 mb-4">
                                    Perfect for tablets with balanced layouts and readable text
                                </p>
                                <div className="text-xs sm:text-sm text-slate-500 space-y-1">
                                    <p>• 2-column grids</p>
                                    <p>• Medium text sizes</p>
                                    <p>• Balanced spacing</p>
                                    <p>• Touch & mouse support</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                        className="sm:col-span-2 lg:col-span-1"
                    >
                        <Card className="bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg sm:text-xl text-center text-purple-600">🖥️ Desktop</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center pt-0">
                                <p className="text-sm sm:text-base text-slate-600 mb-4">
                                    Full desktop experience with multi-column layouts and hover effects
                                </p>
                                <div className="text-xs sm:text-sm text-slate-500 space-y-1">
                                    <p>• 3-column grids</p>
                                    <p>• Large text sizes</p>
                                    <p>• Hover animations</p>
                                    <p>• Maximum content width</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Responsive Features List */}
                <motion.div
                    className="bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                >
                    <h3 className="text-xl sm:text-2xl font-bold text-center mb-6 text-slate-800">Responsive Features Implemented</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Mobile-first design approach</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Responsive typography scaling</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Touch-friendly interface elements</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Flexible grid layouts</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Optimized spacing and padding</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Accessibility improvements</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Performance optimizations</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                                <span className="text-sm sm:text-base text-slate-700">Cross-browser compatibility</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Screen Size Indicator */}
                <motion.div
                    className="mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                >
                    <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm sm:text-base">
                        <span className="font-medium">Current Breakpoint: </span>
                        <span className="sm:hidden">Mobile (default)</span>
                        <span className="hidden sm:inline md:hidden">Small (sm)</span>
                        <span className="hidden md:inline lg:hidden">Medium (md)</span>
                        <span className="hidden lg:inline xl:hidden">Large (lg)</span>
                        <span className="hidden xl:inline 2xl:hidden">Extra Large (xl)</span>
                        <span className="hidden 2xl:inline">2XL</span>
                    </div>
                </motion.div>

                {/* Footer with Design Credit */}
                <motion.footer
                    className="mt-8 sm:mt-12 pt-6 border-t border-slate-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                >
                    <div className="text-center">
                        <p className="text-xs sm:text-sm text-slate-500">
                            Design by <span className="font-medium text-blue-600">Assistant Professor Darshan Ahire</span>
                        </p>
                    </div>
                </motion.footer>
            </div>
        </div>
    );
} 
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user info in localStorage
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');

                // Redirect to main page
                router.push('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Background Image Section - Mobile: Top, Desktop: Left 70% */}
            <div className="lg:hidden w-full h-64 sm:h-80 relative">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/login_background.jpg')`
                    }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center text-white">
                        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Welcome to</h1>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4">Sandip University</h2>
                        <p className="text-sm sm:text-lg opacity-90">Attendance Management System</p>
                    </div>
                </div>
            </div>

            {/* Background Image Section - Desktop: Left 70% */}
            <div className="hidden lg:block lg:w-[70%] relative">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/login_background.jpg')`
                    }}
                >
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="text-center text-white">
                        <h1 className="text-4xl font-bold mb-4">Welcome to</h1>
                        <h2 className="text-6xl font-bold mb-6">Sandip University</h2>
                        <p className="text-xl opacity-90">Attendance Management System</p>
                    </div>
                </div>
            </div>

            {/* Login Container Section - Mobile: Bottom, Desktop: Right 30% */}
            <div className="w-full lg:w-[30%] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 flex-1">
                <div className="w-full max-w-sm sm:max-w-md">
                    {/* Logo and Header */}
                    <motion.div
                        className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
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
                    </motion.div>

                    <motion.h2
                        className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8 text-blue-600"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Attendance Portal Login
                    </motion.h2>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <Card className="bg-white border border-slate-200 rounded-xl shadow-lg">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg sm:text-xl text-center">Sign In</CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6">
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            required
                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg transition-all duration-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg transition-all duration-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                                        />
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <motion.div
                                            className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm sm:text-base"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                                    >
                                        {isLoading ? 'Signing In...' : 'Sign In'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Footer with Design Credit */}
                    <motion.footer
                        className="mt-8 pt-6 border-t border-slate-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <div className="text-center">
                            <p className="text-xs sm:text-sm text-slate-500">
                                Design by <span className="font-medium text-blue-600">Assistant Professor Darshan Ahire</span>
                            </p>
                        </div>
                    </motion.footer>
                </div>
            </div>
        </div>
    );
} 
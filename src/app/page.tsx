'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = () => {
      try {
        const loginStatus = localStorage.getItem('isLoggedIn');
        const userData = localStorage.getItem('user');

        if (loginStatus === 'true' && userData) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleAttendancePortal = () => {
    router.push('/attendance-portal');
  };

  const handleAdminPanel = () => {
    router.push('/admin2025');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">Loading...</div>
          <div className="text-sm sm:text-base text-slate-500">Please wait while we load the attendance portal</div>
        </div>
      </div>
    );
  }

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

          {/* User Info and Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {isLoggedIn ? (
              <>
                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-slate-600">Welcome,</p>
                  <p className="text-sm sm:text-base font-medium text-slate-900 truncate max-w-[200px]">{user?.name || user?.email}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-700 hover:bg-slate-100 w-full sm:w-auto"
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                size="sm"
              >
                Login
              </Button>
            )}
          </div>
        </motion.div>

        <motion.h2
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 text-blue-600 px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Attendance Management System
        </motion.h2>

        <motion.p
          className="text-center text-base sm:text-lg text-slate-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Welcome to Sandip University's comprehensive attendance management system.
          Track student attendance, manage departments, and generate detailed reports.
        </motion.p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className="bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-center text-blue-600">📊 Attendance Portal</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm sm:text-base text-slate-600 mb-4">
                  Submit and track student attendance with sub-division support
                </p>
                <Button
                  onClick={handleAttendancePortal}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                  size="sm"
                >
                  Access Portal
                </Button>
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
                <CardTitle className="text-lg sm:text-xl text-center text-green-600">⚙️ Admin Panel</CardTitle>
              </CardHeader>
              <CardContent className="text-center pt-0">
                <p className="text-sm sm:text-base text-slate-600 mb-4">
                  Manage departments, faculty, subjects, and view reports
                </p>
                <Button
                  onClick={handleAdminPanel}
                  className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
                  size="sm"
                >
                  Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>



        {/* Footer with Design Credit */}
        <motion.footer
          className="mt-12 sm:mt-16 pt-8 border-t border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
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

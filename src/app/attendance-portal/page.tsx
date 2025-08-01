'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Timing {
    id: number;
    label: string;
}

interface Department {
    id: number;
    name: string;
}

interface SubDivision {
    id: number;
    name: string;
    students: number;
    divisionId: number;
}

interface Division {
    id: number;
    name: string;
    totalStudents: number;
    departmentId: number;
    subDivisions: SubDivision[];
}

interface Subject {
    id: number;
    name: string;
    departmentId: number;
}

interface Faculty {
    id: number;
    name: string;
}

export default function AttendancePortal() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [timings, setTimings] = useState<Timing[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [faculty, setFaculty] = useState<Faculty[]>([]);

    const [selectedTiming, setSelectedTiming] = useState<string>('');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('');
    const [selectedDivision, setSelectedDivision] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedFaculty, setSelectedFaculty] = useState<string>('');
    const [presentCount, setPresentCount] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Sub-division selection
    const [selectedSubDivisions, setSelectedSubDivisions] = useState<number[]>([]);

    const selectedDivisionData = divisions.find(d => d.id.toString() === selectedDivision);

    useEffect(() => {
        // Check authentication on component mount
        const checkAuth = () => {
            try {
                const loginStatus = localStorage.getItem('isLoggedIn');
                const userData = localStorage.getItem('user');

                if (loginStatus === 'true' && userData) {
                    setIsLoggedIn(true);
                    setUser(JSON.parse(userData));
                } else {
                    // Redirect to login if not authenticated
                    router.push('/login');
                    return;
                }
            } catch (error) {
                console.error('Auth check error:', error);
                router.push('/login');
                return;
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    // Reset sub-division selection when division changes
    useEffect(() => {
        if (selectedDivisionData && selectedDivisionData.subDivisions.length > 0) {
            // Auto-select all sub-divisions by default
            setSelectedSubDivisions(selectedDivisionData.subDivisions.map(sd => sd.id));
        } else {
            setSelectedSubDivisions([]);
        }
    }, [selectedDivisionData]);

    const fetchData = async () => {
        try {
            const [timingsRes, departmentsRes, facultyRes] = await Promise.all([
                fetch('/api/timings').catch(() => ({ ok: false, json: () => [] })),
                fetch('/api/departments').catch(() => ({ ok: false, json: () => [] })),
                fetch('/api/faculty').catch(() => ({ ok: false, json: () => [] }))
            ]);

            const timingsData = await timingsRes.json();
            const departmentsData = await departmentsRes.json();
            const facultyData = await facultyRes.json();

            // Ensure we always set arrays, even if the API returns an error
            setTimings(Array.isArray(timingsData) ? timingsData : []);
            setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
            setFaculty(Array.isArray(facultyData) ? facultyData : []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please check your connection.');
            // Set empty arrays on error to prevent map errors
            setTimings([]);
            setDepartments([]);
            setFaculty([]);
        }
    };

    const handleDepartmentChange = async (departmentId: string) => {
        setSelectedDepartment(departmentId);
        setSelectedDivision('');
        setSelectedSubject('');

        if (departmentId) {
            try {
                const [divisionsRes, subjectsRes] = await Promise.all([
                    fetch(`/api/divisions?departmentId=${departmentId}`),
                    fetch(`/api/subjects?departmentId=${departmentId}`)
                ]);

                const divisionsData = await divisionsRes.json();
                const subjectsData = await subjectsRes.json();

                // Ensure we always set arrays, even if the API returns an error
                setDivisions(Array.isArray(divisionsData) ? divisionsData : []);
                setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
            } catch (error) {
                console.error('Error fetching department data:', error);
                // Set empty arrays on error to prevent map errors
                setDivisions([]);
                setSubjects([]);
            }
        } else {
            setDivisions([]);
            setSubjects([]);
        }
    };

    const handleSubDivisionToggle = (subDivisionId: number) => {
        setSelectedSubDivisions(prev =>
            prev.includes(subDivisionId)
                ? prev.filter(id => id !== subDivisionId)
                : [...prev, subDivisionId]
        );
    };

    const getTotalSelectedStudents = () => {
        if (!selectedDivisionData) return 0;

        if (selectedDivisionData.subDivisions.length > 0) {
            return selectedDivisionData.subDivisions
                .filter(sd => selectedSubDivisions.includes(sd.id))
                .reduce((sum, sd) => sum + sd.students, 0);
        }

        return selectedDivisionData.totalStudents;
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        router.push('/login');
    };

    const handleSubmit = async () => {
        if (!selectedTiming || !selectedDepartment || !selectedDivision || !selectedSubject || !selectedFaculty || !presentCount) {
            setMessage({ type: 'error', text: 'Please fill in all fields' });
            return;
        }

        const presentCountNum = parseInt(presentCount);
        if (isNaN(presentCountNum) || presentCountNum < 0) {
            setMessage({ type: 'error', text: 'Please enter a valid present count' });
            return;
        }

        const totalStudents = getTotalSelectedStudents();
        if (presentCountNum > totalStudents) {
            setMessage({ type: 'error', text: `Present count cannot exceed total students (${totalStudents})` });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch('/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timingId: parseInt(selectedTiming),
                    divisionId: parseInt(selectedDivision),
                    subjectId: parseInt(selectedSubject),
                    facultyId: parseInt(selectedFaculty),
                    presentCount: presentCountNum,
                    subDivisionIds: selectedSubDivisions.length > 0 ? selectedSubDivisions : null,
                }),
            });

            if (response.ok) {
                setMessage({ type: 'success', text: 'Attendance submitted successfully!' });
                // Reset form
                setSelectedTiming('');
                setSelectedDepartment('');
                setSelectedDivision('');
                setSelectedSubject('');
                setSelectedFaculty('');
                setPresentCount('');
                setSelectedSubDivisions([]);
                setDivisions([]);
                setSubjects([]);
            } else {
                const error = await response.json();
                setMessage({ type: 'error', text: error.message || 'Failed to submit attendance' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred while submitting attendance' });
        } finally {
            setIsSubmitting(false);
        }
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

    // Show login page if not authenticated
    if (!isLoggedIn) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-2xl mx-auto">
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

                    {/* User Info and Logout */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="text-center sm:text-right">
                            <p className="text-xs sm:text-sm text-slate-600">Welcome,</p>
                            <p className="text-sm sm:text-base font-medium text-slate-900 truncate max-w-[200px]">{user?.name || user?.email}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
                            <Button
                                onClick={() => router.push('/')}
                                variant="outline"
                                size="sm"
                                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm"
                            >
                                Home
                            </Button>
                            <Button
                                onClick={() => router.push('/admin2025')}
                                variant="outline"
                                size="sm"
                                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm"
                            >
                                Admin Panel
                            </Button>
                            <Button
                                onClick={handleLogout}
                                variant="outline"
                                size="sm"
                                className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm"
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </motion.div>

                <motion.h2
                    className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-600 px-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Attendance Portal
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg sm:text-xl text-center">Submit Attendance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                            {/* Timing Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="timing" className="text-sm sm:text-base">Timing</Label>
                                <Select value={selectedTiming} onValueChange={setSelectedTiming}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Select timing" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(timings) && timings.map((timing) => (
                                            <SelectItem key={timing.id} value={timing.id.toString()}>
                                                {timing.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Department Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="department" className="text-sm sm:text-base">Department</Label>
                                <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(departments) && departments.map((department) => (
                                            <SelectItem key={department.id} value={department.id.toString()}>
                                                {department.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Division Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="division" className="text-sm sm:text-base">Division</Label>
                                <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Select division" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(divisions) && divisions.map((division) => (
                                            <SelectItem key={division.id} value={division.id.toString()}>
                                                {division.name} ({division.totalStudents} students)
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sub-Division Selection */}
                            {selectedDivisionData && selectedDivisionData.subDivisions.length > 0 && (
                                <div className="space-y-3">
                                    <Label className="text-sm sm:text-base">Sub-Divisions (Select which batches to include)</Label>
                                    <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 border border-slate-200 rounded-lg bg-slate-50">
                                        {selectedDivisionData.subDivisions.map((subDivision) => (
                                            <div key={subDivision.id} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={`sub-${subDivision.id}`}
                                                    checked={selectedSubDivisions.includes(subDivision.id)}
                                                    onCheckedChange={() => handleSubDivisionToggle(subDivision.id)}
                                                />
                                                <Label htmlFor={`sub-${subDivision.id}`} className="flex-1 cursor-pointer text-sm sm:text-base">
                                                    {subDivision.name} ({subDivision.students} students)
                                                </Label>
                                            </div>
                                        ))}
                                        <div className="pt-2 border-t border-slate-200">
                                            <p className="text-sm font-medium text-slate-700">
                                                Total Selected Students: {getTotalSelectedStudents()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Subject Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-sm sm:text-base">Subject</Label>
                                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Select subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(subjects) && subjects.map((subject) => (
                                            <SelectItem key={subject.id} value={subject.id.toString()}>
                                                {subject.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Faculty Selection */}
                            <div className="space-y-2">
                                <Label htmlFor="faculty" className="text-sm sm:text-base">Faculty</Label>
                                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Select faculty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(faculty) && faculty.map((facultyMember) => (
                                            <SelectItem key={facultyMember.id} value={facultyMember.id.toString()}>
                                                {facultyMember.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Present Count Input */}
                            <div className="space-y-2">
                                <Label htmlFor="presentCount" className="text-sm sm:text-base">Present Count</Label>
                                <Input
                                    id="presentCount"
                                    type="number"
                                    value={presentCount}
                                    onChange={(e) => setPresentCount(e.target.value)}
                                    placeholder="Enter number of present students"
                                    min="0"
                                    max={getTotalSelectedStudents() || 999}
                                    className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg transition-all duration-300 hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                                />
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Total students: {getTotalSelectedStudents()}
                                </p>
                            </div>

                            {/* Message Display */}
                            {message && (
                                <motion.div
                                    className={`p-3 rounded-md text-sm sm:text-base ${message.type === 'success'
                                        ? 'bg-green-50 border border-green-200 text-green-700'
                                        : 'bg-red-50 border border-red-200 text-red-700'
                                        }`}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    {message.text}
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Footer with Design Credit */}
                <motion.footer
                    className="mt-8 sm:mt-12 pt-6 border-t border-slate-200"
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
    );
} 
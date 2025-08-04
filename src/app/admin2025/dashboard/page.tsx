'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Image from 'next/image';

interface Faculty {
    id: number;
    name: string;
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
    division?: Division;
}

interface Division {
    id: number;
    name: string;
    totalStudents: number;
    departmentId: number;
    department?: Department;
    subDivisions: SubDivision[];
}

interface Subject {
    id: number;
    name: string;
    departmentId: number;
}

interface Timing {
    id: number;
    label: string;
}

interface AttendanceRecord {
    id: number;
    division: Division;
    subDivision?: SubDivision;
    subject: Subject;
    faculty: Faculty;
    timing: Timing;
    presentCount: number;
    attendanceDate: string;
    percentage: number;
    totalStudents: number;
    attendanceType: string;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('reports');
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [timings, setTimings] = useState<Timing[]>([]);
    const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<{
        id: number;
        name?: string;
        label?: string;
        departmentId?: number;
        totalStudents?: number;
        students?: number;
        divisionId?: number;
    } | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        label: '',
        departmentId: '',
        totalStudents: '',
        students: '',
        divisionId: '',
    });

    // Filter states
    const [selectedDivisionFilter, setSelectedDivisionFilter] = useState<string>('all');
    const [selectedTimeRange, setSelectedTimeRange] = useState<string>('today');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === 'reports') {
            fetchAttendanceReports();
        }
    }, [activeTab, selectedDivisionFilter, selectedTimeRange]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('Fetching admin data...');

            const [facultyRes, departmentsRes, divisionsRes, subjectsRes, timingsRes, subDivisionsRes] = await Promise.all([
                fetch('/api/admin/faculty'),
                fetch('/api/admin/departments'),
                fetch('/api/admin/divisions'),
                fetch('/api/admin/subjects'),
                fetch('/api/admin/timings'),
                fetch('/api/admin/sub-divisions'),
            ]);

            const facultyData = await facultyRes.json();
            const departmentsData = await departmentsRes.json();
            const divisionsData = await divisionsRes.json();
            const subjectsData = await subjectsRes.json();
            const timingsData = await timingsRes.json();
            const subDivisionsData = await subDivisionsRes.json();

            console.log('API Responses:', {
                faculty: facultyData,
                departments: departmentsData,
                divisions: divisionsData,
                subjects: subjectsData,
                timings: timingsData,
                subDivisions: subDivisionsData
            });

            // Ensure we always set arrays, even if the API returns an error
            setFaculty(Array.isArray(facultyData) ? facultyData : []);
            setDepartments(Array.isArray(departmentsData) ? departmentsData : []);
            setDivisions(Array.isArray(divisionsData) ? divisionsData : []);
            setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
            setTimings(Array.isArray(timingsData) ? timingsData : []);
            setSubDivisions(Array.isArray(subDivisionsData) ? subDivisionsData : []);

            console.log('State updated with data');
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to load data. Please check your connection.');
            // Set empty arrays on error to prevent map errors
            setFaculty([]);
            setDepartments([]);
            setDivisions([]);
            setSubjects([]);
            setTimings([]);
            setSubDivisions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttendanceReports = async () => {
        try {
            const params = new URLSearchParams();
            if (selectedDivisionFilter && selectedDivisionFilter !== 'all') params.append('divisionId', selectedDivisionFilter);
            if (selectedTimeRange) params.append('timeRange', selectedTimeRange);

            const response = await fetch(`/api/admin/attendance-reports?${params}`);
            if (response.ok) {
                const data = await response.json();
                setAttendanceRecords(data);
            }
        } catch (error) {
            console.error('Error fetching attendance reports:', error);
        }
    };

    const handleAdd = async () => {
        try {
            console.log('handleAdd called for tab:', activeTab);
            console.log('formData:', formData);

            let endpoint = '';
            let data = {};

            switch (activeTab) {
                case 'faculty':
                    endpoint = '/api/admin/faculty';
                    data = { name: formData.name };
                    break;
                case 'departments':
                    endpoint = '/api/admin/departments';
                    data = { name: formData.name };
                    break;
                case 'divisions':
                    endpoint = '/api/admin/divisions';
                    data = {
                        name: formData.name,
                        departmentId: parseInt(formData.departmentId),
                        totalStudents: parseInt(formData.totalStudents)
                    };
                    break;
                case 'sub-divisions':
                    endpoint = '/api/admin/sub-divisions';
                    data = {
                        name: formData.name,
                        students: parseInt(formData.students),
                        divisionId: parseInt(formData.divisionId)
                    };
                    break;
                case 'subjects':
                    endpoint = '/api/admin/subjects';
                    data = { name: formData.name, departmentId: parseInt(formData.departmentId) };
                    break;
                case 'timings':
                    endpoint = '/api/admin/timings';
                    data = { label: formData.label };
                    break;
            }

            console.log('Making request to:', endpoint);
            console.log('Request data:', data);

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);

            if (response.ok) {
                setIsAddDialogOpen(false);
                setFormData({ name: '', label: '', departmentId: '', totalStudents: '', students: '', divisionId: '' });
                fetchData();
            } else {
                console.error('Failed to add item:', responseData);
                alert('Failed to add item: ' + (responseData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item: ' + error);
        }
    };

    const handleEdit = async () => {
        try {
            let endpoint = '';
            let data = {};

            switch (activeTab) {
                case 'faculty':
                    endpoint = `/api/admin/faculty/${editingItem.id}`;
                    data = { name: formData.name };
                    break;
                case 'departments':
                    endpoint = `/api/admin/departments/${editingItem.id}`;
                    data = { name: formData.name };
                    break;
                case 'divisions':
                    endpoint = `/api/admin/divisions/${editingItem.id}`;
                    data = {
                        name: formData.name,
                        departmentId: parseInt(formData.departmentId),
                        totalStudents: parseInt(formData.totalStudents)
                    };
                    break;
                case 'sub-divisions':
                    endpoint = `/api/admin/sub-divisions/${editingItem.id}`;
                    data = {
                        name: formData.name,
                        students: parseInt(formData.students),
                        divisionId: parseInt(formData.divisionId)
                    };
                    break;
                case 'subjects':
                    endpoint = `/api/admin/subjects/${editingItem.id}`;
                    data = { name: formData.name, departmentId: parseInt(formData.departmentId) };
                    break;
                case 'timings':
                    endpoint = `/api/admin/timings/${editingItem.id}`;
                    data = { label: formData.label };
                    break;
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setIsEditDialogOpen(false);
                setEditingItem(null);
                setFormData({ name: '', label: '', departmentId: '', totalStudents: '', students: '', divisionId: '' });
                fetchData();
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            let endpoint = '';
            switch (activeTab) {
                case 'faculty':
                    endpoint = `/api/admin/faculty/${id}`;
                    break;
                case 'departments':
                    endpoint = `/api/admin/departments/${id}`;
                    break;
                case 'divisions':
                    endpoint = `/api/admin/divisions/${id}`;
                    break;
                case 'sub-divisions':
                    endpoint = `/api/admin/sub-divisions/${id}`;
                    break;
                case 'subjects':
                    endpoint = `/api/admin/subjects/${id}`;
                    break;
                case 'timings':
                    endpoint = `/api/admin/timings/${id}`;
                    break;
            }

            const response = await fetch(endpoint, { method: 'DELETE' });
            if (response.ok) {
                fetchData();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const openEditDialog = (item: {
        id: number;
        name?: string;
        label?: string;
        departmentId?: number;
        totalStudents?: number;
        students?: number;
        divisionId?: number;
    }) => {
        setEditingItem(item);
        setFormData({
            name: item.name || '',
            label: item.label || '',
            departmentId: item.departmentId?.toString() || '',
            totalStudents: item.totalStudents?.toString() || '',
            students: item.students?.toString() || '',
            divisionId: item.divisionId?.toString() || '',
        });
        setIsEditDialogOpen(true);
    };

    const getCurrentData = () => {
        const data = (() => {
            switch (activeTab) {
                case 'faculty': return faculty;
                case 'departments': return departments;
                case 'divisions': return divisions;
                case 'sub-divisions': return subDivisions;
                case 'subjects': return subjects;
                case 'timings': return timings;
                default: return [];
            }
        })();

        console.log('getCurrentData for tab:', activeTab, 'returning:', data);
        return data;
    };

    const getTabTitle = () => {
        switch (activeTab) {
            case 'reports': return 'Attendance Reports';
            case 'faculty': return 'Faculty';
            case 'departments': return 'Departments';
            case 'divisions': return 'Divisions';
            case 'sub-divisions': return 'Sub-Divisions';
            case 'subjects': return 'Subjects';
            case 'timings': return 'Timings';
            default: return '';
        }
    };

    const exportToCSV = () => {
        // Generate date comment based on selected time range
        const getDateComment = () => {
            const today = new Date();
            const formatDate = (date: Date) => date.toLocaleDateString('en-GB'); // DD/MM/YYYY format

            switch (selectedTimeRange) {
                case 'today':
                    return `Date: ${formatDate(today)}`;
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate() - 1);
                    return `Date: ${formatDate(yesterday)}`;
                case 'thisMonth':
                    const oneMonthAgo = new Date(today);
                    oneMonthAgo.setMonth(today.getMonth() - 1);
                    return `Date Range: ${formatDate(oneMonthAgo)} to ${formatDate(today)}`;
                case 'thisYear':
                    const oneYearAgo = new Date(today);
                    oneYearAgo.setFullYear(today.getFullYear() - 1);
                    return `Date Range: ${formatDate(oneYearAgo)} to ${formatDate(today)}`;
                default:
                    return `Date: ${formatDate(today)}`;
            }
        };

        const headers = ['Division/Sub-Division', 'Subject', 'Faculty', 'Time', 'Present Count', 'Total Students', 'Percentage', 'Date'];

        // Group records by department and division
        const groupedRecords: { [key: string]: AttendanceRecord[] } = {};

        attendanceRecords.forEach(record => {
            const departmentName = record.division.department?.name || 'Unknown Department';
            const divisionName = record.division.name;
            const key = `${departmentName}-${divisionName}`;

            if (!groupedRecords[key]) {
                groupedRecords[key] = [];
            }
            groupedRecords[key].push(record);
        });

        // Export separate CSV for each department-division combination
        Object.entries(groupedRecords).forEach(([key, records]) => {
            const [departmentName, divisionName] = key.split('-');

            // Calculate summary statistics for this group
            const totalPresent = records.reduce((sum, record) => sum + record.presentCount, 0);
            const totalStudents = records.reduce((sum, record) => sum + record.totalStudents, 0);
            const totalPercentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
            const totalLectures = records.length;

            const csvData = records.map(record => [
                record.attendanceType,
                record.subject.name,
                record.faculty.name,
                record.timing.label,
                record.presentCount,
                record.totalStudents,
                `${record.percentage}%`,
                new Date(record.attendanceDate).toLocaleDateString()
            ]);

            // Add date comment and summary rows
            const summaryRows = [
                [],
                [getDateComment()],
                [],
                [`Department: ${departmentName}`],
                [`Division: ${divisionName}`],
                [],
                ['SUMMARY'],
                [`Total Lectures: ${totalLectures}`],
                [`Total Present Students: ${totalPresent}`],
                [`Total Students: ${totalStudents}`],
                [`Overall Attendance Percentage: ${totalPercentage}%`],
                []
            ];

            const csvContent = [headers, ...csvData, ...summaryRows]
                .map(row => row.map(cell => `"${cell}"`).join(','))
                .join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            // Create filename with department and division names
            const safeDepartmentName = departmentName.replace(/[^a-zA-Z0-9]/g, '_');
            const safeDivisionName = divisionName.replace(/[^a-zA-Z0-9]/g, '_');
            a.download = `attendance-${safeDepartmentName}-${safeDivisionName}-${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        });
    };

    const renderReportsTab = () => {
        // Calculate summary statistics
        const totalPresent = attendanceRecords.reduce((sum, record) => sum + record.presentCount, 0);
        const totalStudents = attendanceRecords.reduce((sum, record) => sum + record.totalStudents, 0);
        const totalPercentage = totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0;
        const totalLectures = attendanceRecords.length;

        return (
            <div className="space-y-4 sm:space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0">
                        <CardContent className="p-3 sm:p-4">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold">{totalLectures}</div>
                                <div className="text-xs sm:text-sm opacity-90">Total Lectures</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-pink-500 to-red-500 text-white border-0">
                        <CardContent className="p-3 sm:p-4">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold">{totalPresent}</div>
                                <div className="text-xs sm:text-sm opacity-90">Present Students</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
                        <CardContent className="p-3 sm:p-4">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold">{totalStudents}</div>
                                <div className="text-xs sm:text-sm opacity-90">Total Students</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
                        <CardContent className="p-3 sm:p-4">
                            <div className="text-center">
                                <div className="text-lg sm:text-2xl font-bold">{totalPercentage}%</div>
                                <div className="text-xs sm:text-sm opacity-90">Overall Attendance</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base sm:text-lg">Filters</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm sm:text-base">Division</Label>
                                <Select value={selectedDivisionFilter} onValueChange={setSelectedDivisionFilter}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="All divisions" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All divisions</SelectItem>
                                        {Array.isArray(divisions) && divisions.map((division) => (
                                            <SelectItem key={division.id} value={division.id.toString()}>
                                                {division.name} ({division.department?.name})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm sm:text-base">Time Range</Label>
                                <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="today">Today</SelectItem>
                                        <SelectItem value="yesterday">Yesterday</SelectItem>
                                        <SelectItem value="thisMonth">This Month</SelectItem>
                                        <SelectItem value="thisYear">This Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-end">
                                <Button onClick={exportToCSV} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base">
                                    Export CSV (Separate Files)
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attendance Reports Table */}
                <Card className="bg-white border border-slate-200 rounded-xl shadow-lg">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base sm:text-lg">Attendance Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Division/Sub-Division</th>
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Subject</th>
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Faculty</th>
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Time</th>
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Present</th>
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Total</th>
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Percentage</th>
                                        <th className="text-left p-2 sm:p-3 font-semibold text-slate-700 text-xs sm:text-sm">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceRecords.map((record) => (
                                        <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="p-2 sm:p-3">
                                                <div>
                                                    <div className="font-medium text-xs sm:text-sm">{record.attendanceType}</div>
                                                    {record.subDivision && (
                                                        <div className="text-xs text-slate-500">
                                                            Sub-division: {record.subDivision.name}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2 sm:p-3 text-xs sm:text-sm">{record.subject.name}</td>
                                            <td className="p-2 sm:p-3 text-xs sm:text-sm">{record.faculty.name}</td>
                                            <td className="p-2 sm:p-3 text-xs sm:text-sm">{record.timing.label}</td>
                                            <td className="p-2 sm:p-3 text-xs sm:text-sm">{record.presentCount}</td>
                                            <td className="p-2 sm:p-3 text-xs sm:text-sm">{record.totalStudents}</td>
                                            <td className="p-2 sm:p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${record.percentage >= 80
                                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                                    : record.percentage >= 60
                                                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                        : 'bg-red-100 text-red-800 border border-red-200'
                                                    }`}>
                                                    {record.percentage}%
                                                </span>
                                            </td>
                                            <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                                {new Date(record.attendanceDate).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {attendanceRecords.length === 0 && (
                                <div className="text-center py-8 text-slate-500 text-sm sm:text-base">
                                    No attendance records found for the selected filters.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderManagementTab = () => (
        <Card className="bg-white border border-slate-200 rounded-xl shadow-lg">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg sm:text-xl">{getTabTitle()} Management</CardTitle>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base w-full sm:w-auto">
                            Add {getTabTitle().slice(0, -1)}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-sm sm:max-w-md mx-4">
                        <DialogHeader>
                            <DialogTitle className="text-base sm:text-lg">Add {getTabTitle().slice(0, -1)}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {(activeTab === 'faculty' || activeTab === 'departments') && (
                                <div className="space-y-2">
                                    <Label className="text-sm sm:text-base">Name</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={`Enter ${activeTab.slice(0, -1)} name`}
                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                    />
                                </div>
                            )}
                            {activeTab === 'divisions' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter division name"
                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Department</Label>
                                        <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                                            <SelectTrigger className="text-sm sm:text-base">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(departments) && departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Total Students</Label>
                                        <Input
                                            type="number"
                                            value={formData.totalStudents}
                                            onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
                                            placeholder="Enter total number of students"
                                            min="1"
                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                        />
                                    </div>
                                </>
                            )}
                            {activeTab === 'sub-divisions' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter sub-division name (e.g., A1, A2, A3)"
                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Division</Label>
                                        <Select value={formData.divisionId} onValueChange={(value) => setFormData({ ...formData, divisionId: value })}>
                                            <SelectTrigger className="text-sm sm:text-base">
                                                <SelectValue placeholder="Select division" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(divisions) && divisions.map((div) => (
                                                    <SelectItem key={div.id} value={div.id.toString()}>
                                                        {div.name} ({div.department?.name})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Number of Students</Label>
                                        <Input
                                            type="number"
                                            value={formData.students}
                                            onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                                            placeholder="Enter number of students in this sub-division"
                                            min="1"
                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                        />
                                    </div>
                                </>
                            )}
                            {activeTab === 'subjects' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter subject name"
                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm sm:text-base">Department</Label>
                                        <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                                            <SelectTrigger className="text-sm sm:text-base">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.isArray(departments) && departments.map((dept) => (
                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                        {dept.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </>
                            )}
                            {activeTab === 'timings' && (
                                <div className="space-y-2">
                                    <Label className="text-sm sm:text-base">Label</Label>
                                    <Input
                                        value={formData.label}
                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                        placeholder="Enter timing label (e.g., 7:00 AM - 8:00 AM)"
                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                    />
                                </div>
                            )}
                            <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base">
                                Add
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                    {getCurrentData().map((item: {
                        id: number;
                        name?: string;
                        label?: string;
                        departmentId?: number;
                        totalStudents?: number;
                        students?: number;
                        divisionId?: number;
                    }) => (
                        <motion.div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors gap-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="flex-1">
                                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{item.name || item.label}</h3>
                                {activeTab === 'divisions' && (
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Department: {departments.find(d => d.id === item.departmentId)?.name} |
                                        Total Students: {item.totalStudents} |
                                        Sub-Divisions: {item.subDivisions?.length || 0}
                                    </p>
                                )}
                                {activeTab === 'sub-divisions' && (
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Division: {divisions.find(d => d.id === item.divisionId)?.name} |
                                        Students: {item.students}
                                    </p>
                                )}
                                {(activeTab === 'subjects') && (
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Department: {departments.find(d => d.id === item.departmentId)?.name}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditDialog(item)}
                                            className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm"
                                        >
                                            Edit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-sm sm:max-w-md mx-4">
                                        <DialogHeader>
                                            <DialogTitle className="text-base sm:text-lg">Edit {getTabTitle().slice(0, -1)}</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            {(activeTab === 'faculty' || activeTab === 'departments') && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm sm:text-base">Name</Label>
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                                    />
                                                </div>
                                            )}
                                            {activeTab === 'divisions' && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Name</Label>
                                                        <Input
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Department</Label>
                                                        <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                                                            <SelectTrigger className="text-sm sm:text-base">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.isArray(departments) && departments.map((dept) => (
                                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                                        {dept.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Total Students</Label>
                                                        <Input
                                                            type="number"
                                                            value={formData.totalStudents}
                                                            onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
                                                            min="1"
                                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {activeTab === 'sub-divisions' && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Name</Label>
                                                        <Input
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Division</Label>
                                                        <Select value={formData.divisionId} onValueChange={(value) => setFormData({ ...formData, divisionId: value })}>
                                                            <SelectTrigger className="text-sm sm:text-base">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.isArray(divisions) && divisions.map((div) => (
                                                                    <SelectItem key={div.id} value={div.id.toString()}>
                                                                        {div.name} ({div.department?.name})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Number of Students</Label>
                                                        <Input
                                                            type="number"
                                                            value={formData.students}
                                                            onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                                                            min="1"
                                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {activeTab === 'subjects' && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Name</Label>
                                                        <Input
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm sm:text-base">Department</Label>
                                                        <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                                                            <SelectTrigger className="text-sm sm:text-base">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {Array.isArray(departments) && departments.map((dept) => (
                                                                    <SelectItem key={dept.id} value={dept.id.toString()}>
                                                                        {dept.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </>
                                            )}
                                            {activeTab === 'timings' && (
                                                <div className="space-y-2">
                                                    <Label className="text-sm sm:text-base">Label</Label>
                                                    <Input
                                                        value={formData.label}
                                                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg text-sm sm:text-base"
                                                    />
                                                </div>
                                            )}
                                            <Button onClick={handleEdit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base">
                                                Update
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">Loading...</div>
                    <div className="text-sm sm:text-base text-slate-500">Please wait while we load the dashboard</div>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-red-600 mb-4">Error</div>
                    <div className="text-sm sm:text-base text-slate-500 mb-4">{error}</div>
                    <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
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

                    {/* Navigation Links */}
                    <div className="flex gap-2">
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            size="sm"
                            className="border-slate-200 text-slate-700 hover:bg-slate-100 text-xs sm:text-sm"
                        >
                            Attendance Portal
                        </Button>
                    </div>
                </motion.div>

                <motion.h2
                    className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-blue-600 px-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Admin Dashboard
                </motion.h2>

                {/* Navigation Tabs */}
                <motion.div
                    className="flex flex-wrap gap-2 mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {['reports', 'faculty', 'departments', 'divisions', 'sub-divisions', 'subjects', 'timings'].map((tab) => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? 'default' : 'outline'}
                            onClick={() => setActiveTab(tab)}
                            size="sm"
                            className={`capitalize text-xs sm:text-sm ${activeTab === tab
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                                }`}
                        >
                            {tab}
                        </Button>
                    ))}
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    {activeTab === 'reports' ? renderReportsTab() : renderManagementTab()}
                </motion.div>

                {/* Footer with Design Credit */}
                <motion.footer
                    className="mt-8 sm:mt-12 pt-6 border-t border-slate-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
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
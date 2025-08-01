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

export default function TestAdminPage() {
    const [activeTab, setActiveTab] = useState('departments');
    const [faculty, setFaculty] = useState<Faculty[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [timings, setTimings] = useState<Timing[]>([]);
    const [subDivisions, setSubDivisions] = useState<SubDivision[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const [formData, setFormData] = useState({
        name: '',
        label: '',
        departmentId: '',
        totalStudents: '',
        students: '',
        divisionId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('Fetching test admin data...');

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
            } else {
                const errorData = await response.json();
                alert('Failed to delete item: ' + (errorData.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Error deleting item: ' + error);
        }
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
            case 'faculty': return 'Faculty';
            case 'departments': return 'Departments';
            case 'divisions': return 'Divisions';
            case 'sub-divisions': return 'Sub-Divisions';
            case 'subjects': return 'Subjects';
            case 'timings': return 'Timings';
            default: return '';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-4">Loading...</div>
                    <div className="text-slate-500">Please wait while we load the dashboard</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-4">Error</div>
                    <div className="text-slate-500 mb-4">{error}</div>
                    <Button onClick={fetchData} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Logo and Header */}
                <motion.div
                    className="flex items-center gap-4 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Image
                        src="/logo.png"
                        alt="Sandip University Logo"
                        width={64}
                        height={64}
                        className="w-16 h-16 object-contain drop-shadow-md"
                    />
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-red-600 tracking-wider">SANDIP</h1>
                        <div className="w-24 h-0.5 bg-yellow-500 mb-1"></div>
                        <p className="text-sm text-slate-600 tracking-wider">UNIVERSITY</p>
                        <p className="text-xs text-gray-500">(UGC Recognized)</p>
                    </div>
                </motion.div>

                <motion.h2
                    className="text-3xl font-bold text-center mb-8 text-blue-600"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Test Admin Dashboard
                </motion.h2>

                {/* Navigation Tabs */}
                <motion.div
                    className="flex space-x-2 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    {['faculty', 'departments', 'divisions', 'sub-divisions', 'subjects', 'timings'].map((tab) => (
                        <Button
                            key={tab}
                            variant={activeTab === tab ? 'default' : 'outline'}
                            onClick={() => setActiveTab(tab)}
                            className={`capitalize ${activeTab === tab
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
                    <Card className="bg-white border border-slate-200 rounded-xl shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl">{getTabTitle()} Management</CardTitle>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                        Add {getTabTitle().slice(0, -1)}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white border border-slate-200 rounded-xl shadow-xl">
                                    <DialogHeader>
                                        <DialogTitle>Add {getTabTitle().slice(0, -1)}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        {(activeTab === 'faculty' || activeTab === 'departments') && (
                                            <div className="space-y-2">
                                                <Label>Name</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder={`Enter ${activeTab.slice(0, -1)} name`}
                                                    className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg"
                                                />
                                            </div>
                                        )}
                                        {activeTab === 'divisions' && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label>Name</Label>
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Enter division name"
                                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Department</Label>
                                                    <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                                                        <SelectTrigger>
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
                                                    <Label>Total Students</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.totalStudents}
                                                        onChange={(e) => setFormData({ ...formData, totalStudents: e.target.value })}
                                                        placeholder="Enter total number of students"
                                                        min="1"
                                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {activeTab === 'sub-divisions' && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label>Name</Label>
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Enter sub-division name (e.g., A1, A2, A3)"
                                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Division</Label>
                                                    <Select value={formData.divisionId} onValueChange={(value) => setFormData({ ...formData, divisionId: value })}>
                                                        <SelectTrigger>
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
                                                    <Label>Number of Students</Label>
                                                    <Input
                                                        type="number"
                                                        value={formData.students}
                                                        onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                                                        placeholder="Enter number of students in this sub-division"
                                                        min="1"
                                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {activeTab === 'subjects' && (
                                            <>
                                                <div className="space-y-2">
                                                    <Label>Name</Label>
                                                    <Input
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Enter subject name"
                                                        className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Department</Label>
                                                    <Select value={formData.departmentId} onValueChange={(value) => setFormData({ ...formData, departmentId: value })}>
                                                        <SelectTrigger>
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
                                                <Label>Label</Label>
                                                <Input
                                                    value={formData.label}
                                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                                    placeholder="Enter timing label (e.g., 7:00 AM - 8:00 AM)"
                                                    className="w-full bg-white border border-slate-200 text-slate-900 p-3 rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <Button onClick={handleAdd} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                                            Add
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {getCurrentData().map((item: any) => (
                                    <motion.div
                                        key={item.id}
                                        className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{item.name || item.label}</h3>
                                            {activeTab === 'divisions' && (
                                                <p className="text-sm text-slate-500">
                                                    Department: {departments.find(d => d.id === item.departmentId)?.name} |
                                                    Total Students: {item.totalStudents} |
                                                    Sub-Divisions: {item.subDivisions?.length || 0}
                                                </p>
                                            )}
                                            {activeTab === 'sub-divisions' && (
                                                <p className="text-sm text-slate-500">
                                                    Division: {divisions.find(d => d.id === item.divisionId)?.name} |
                                                    Students: {item.students}
                                                </p>
                                            )}
                                            {(activeTab === 'subjects') && (
                                                <p className="text-sm text-slate-500">
                                                    Department: {departments.find(d => d.id === item.departmentId)?.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => alert('Edit functionality not implemented in test version')}
                                                className="border-slate-200 text-slate-700 hover:bg-slate-100"
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </motion.div>
                                ))}
                                {getCurrentData().length === 0 && (
                                    <div className="text-center py-8 text-slate-500">
                                        No {getTabTitle().toLowerCase()} found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
} 
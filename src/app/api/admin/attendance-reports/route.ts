import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const divisionId = searchParams.get('divisionId');
        const departmentId = searchParams.get('departmentId');
        const timeRange = searchParams.get('timeRange') || 'today';

        // Build date filter based on time range
        const now = new Date();
        let dateFilter: any = {};

        switch (timeRange) {
            case 'today':
                dateFilter = {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
                };
                break;
            case 'yesterday':
                dateFilter = {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1),
                    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                };
                break;
            case 'thisMonth':
                dateFilter = {
                    gte: new Date(now.getFullYear(), now.getMonth(), 1),
                    lt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
                };
                break;
            case 'thisYear':
                dateFilter = {
                    gte: new Date(now.getFullYear(), 0, 1),
                    lt: new Date(now.getFullYear() + 1, 0, 1),
                };
                break;
        }

        // Build where clause
        const whereClause: any = {
            attendanceDate: dateFilter,
        };

        if (divisionId) {
            whereClause.divisionId = parseInt(divisionId);
        }

        if (departmentId) {
            whereClause.division = {
                departmentId: parseInt(departmentId)
            };
        }

        const attendanceRecords = await prisma.attendance.findMany({
            where: whereClause,
            include: {
                division: {
                    include: {
                        department: true,
                    },
                },
                subDivision: true,
                subject: true,
                faculty: true,
                timing: true,
            },
            orderBy: {
                attendanceDate: 'desc',
            },
        });

        // Calculate percentage for each record based on sub-division or division
        const recordsWithPercentage = attendanceRecords.map(record => {
            let totalStudents: number;
            let attendanceType: string;

            if (record.subDivision) {
                // If sub-division exists, use sub-division student count
                totalStudents = record.subDivision.students;
                attendanceType = `${record.division.name} - ${record.subDivision.name}`;
            } else {
                // If no sub-division, use division total students
                totalStudents = record.division.totalStudents;
                attendanceType = record.division.name;
            }

            return {
                ...record,
                percentage: Math.round((record.presentCount / totalStudents) * 100),
                totalStudents,
                attendanceType,
            };
        });

        return NextResponse.json(recordsWithPercentage);
    } catch (error) {
        console.error('Error fetching attendance reports:', error);
        return NextResponse.json(
            { error: 'Failed to fetch attendance reports' },
            { status: 500 }
        );
    }
} 
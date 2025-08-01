import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { timingId, divisionId, subjectId, facultyId, presentCount, subDivisionIds } = body;

        if (!timingId || !divisionId || !subjectId || !facultyId || presentCount === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (presentCount < 0) {
            return NextResponse.json({ error: 'Present count cannot be negative' }, { status: 400 });
        }

        // If sub-divisions are specified, create attendance records for each selected sub-division
        if (subDivisionIds && Array.isArray(subDivisionIds) && subDivisionIds.length > 0) {
            const subDivisions = await prisma.subDivision.findMany({
                where: { id: { in: subDivisionIds } }
            });

            if (subDivisions.length === 0) {
                return NextResponse.json({ error: 'No valid sub-divisions found' }, { status: 400 });
            }

            const totalStudents = subDivisions.reduce((sum, sd) => sum + sd.students, 0);
            if (presentCount > totalStudents) {
                return NextResponse.json({
                    error: `Present count (${presentCount}) cannot exceed total students (${totalStudents})`
                }, { status: 400 });
            }

            // Calculate present count per sub-division (proportional distribution)
            const attendanceRecords = [];
            let remainingPresent = presentCount;

            for (let i = 0; i < subDivisions.length; i++) {
                const subDivision = subDivisions[i];
                let subDivisionPresent;

                if (i === subDivisions.length - 1) {
                    // Last sub-division gets remaining present count
                    subDivisionPresent = remainingPresent;
                } else {
                    // Proportional distribution
                    const proportion = subDivision.students / totalStudents;
                    subDivisionPresent = Math.round(presentCount * proportion);
                    remainingPresent -= subDivisionPresent;
                }

                const attendance = await prisma.attendance.create({
                    data: {
                        divisionId: parseInt(divisionId),
                        subDivisionId: subDivision.id,
                        subjectId: parseInt(subjectId),
                        facultyId: parseInt(facultyId),
                        timingId: parseInt(timingId),
                        presentCount: subDivisionPresent,
                    },
                    include: {
                        division: true,
                        subDivision: true,
                        subject: true,
                        faculty: true,
                        timing: true,
                    },
                });

                attendanceRecords.push(attendance);
            }

            return NextResponse.json({
                message: 'Attendance submitted successfully',
                records: attendanceRecords
            });
        } else {
            // Regular division attendance (no sub-divisions)
            const division = await prisma.division.findUnique({
                where: { id: parseInt(divisionId) }
            });

            if (!division) {
                return NextResponse.json({ error: 'Division not found' }, { status: 404 });
            }

            if (presentCount > division.totalStudents) {
                return NextResponse.json({
                    error: `Present count (${presentCount}) cannot exceed total students (${division.totalStudents})`
                }, { status: 400 });
            }

            const attendance = await prisma.attendance.create({
                data: {
                    divisionId: parseInt(divisionId),
                    subjectId: parseInt(subjectId),
                    facultyId: parseInt(facultyId),
                    timingId: parseInt(timingId),
                    presentCount: presentCount,
                },
                include: {
                    division: true,
                    subDivision: true,
                    subject: true,
                    faculty: true,
                    timing: true,
                },
            });

            return NextResponse.json({
                message: 'Attendance submitted successfully',
                record: attendance
            });
        }
    } catch (error) {
        console.error('Error submitting attendance:', error);
        return NextResponse.json({ error: 'Failed to submit attendance' }, { status: 500 });
    }
} 
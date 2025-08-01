import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, departmentId, totalStudents } = body;

        if (!name || !departmentId || totalStudents === undefined) {
            return NextResponse.json(
                { error: 'Name, department ID, and total students are required' },
                { status: 400 }
            );
        }

        if (totalStudents <= 0) {
            return NextResponse.json(
                { error: 'Total students must be greater than 0' },
                { status: 400 }
            );
        }

        const division = await prisma.division.update({
            where: { id: parseInt(id) },
            data: {
                name,
                departmentId: parseInt(departmentId),
                totalStudents: parseInt(totalStudents),
            },
            include: {
                department: true,
                subDivisions: true,
            },
        });

        return NextResponse.json(division);
    } catch (error) {
        console.error('Error updating division:', error);
        return NextResponse.json(
            { error: 'Failed to update division' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.division.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Division deleted successfully' });
    } catch (error) {
        console.error('Error deleting division:', error);
        return NextResponse.json(
            { error: 'Failed to delete division' },
            { status: 500 }
        );
    }
} 
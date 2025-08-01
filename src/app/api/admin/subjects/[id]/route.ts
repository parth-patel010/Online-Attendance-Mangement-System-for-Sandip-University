import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, departmentId } = body;

        if (!name || !departmentId) {
            return NextResponse.json(
                { error: 'Name and department ID are required' },
                { status: 400 }
            );
        }

        const subject = await prisma.subject.update({
            where: { id: parseInt(id) },
            data: {
                name,
                departmentId: parseInt(departmentId),
            },
            include: {
                department: true,
            },
        });

        return NextResponse.json(subject);
    } catch (error) {
        console.error('Error updating subject:', error);
        return NextResponse.json(
            { error: 'Failed to update subject' },
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
        await prisma.subject.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Subject deleted successfully' });
    } catch (error) {
        console.error('Error deleting subject:', error);
        return NextResponse.json(
            { error: 'Failed to delete subject' },
            { status: 500 }
        );
    }
} 
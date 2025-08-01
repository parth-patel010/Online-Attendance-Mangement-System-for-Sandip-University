import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const faculty = await prisma.faculty.update({
            where: { id: parseInt(id) },
            data: { name },
        });

        return NextResponse.json(faculty);
    } catch (error) {
        console.error('Error updating faculty:', error);
        return NextResponse.json(
            { error: 'Failed to update faculty' },
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
        await prisma.faculty.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Faculty deleted successfully' });
    } catch (error) {
        console.error('Error deleting faculty:', error);
        return NextResponse.json(
            { error: 'Failed to delete faculty' },
            { status: 500 }
        );
    }
} 
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { label } = body;

        if (!label) {
            return NextResponse.json(
                { error: 'Label is required' },
                { status: 400 }
            );
        }

        const timing = await prisma.timing.update({
            where: { id: parseInt(id) },
            data: { label },
        });

        return NextResponse.json(timing);
    } catch (error) {
        console.error('Error updating timing:', error);
        return NextResponse.json(
            { error: 'Failed to update timing' },
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
        await prisma.timing.delete({
            where: { id: parseInt(id) },
        });

        return NextResponse.json({ message: 'Timing deleted successfully' });
    } catch (error) {
        console.error('Error deleting timing:', error);
        return NextResponse.json(
            { error: 'Failed to delete timing' },
            { status: 500 }
        );
    }
} 
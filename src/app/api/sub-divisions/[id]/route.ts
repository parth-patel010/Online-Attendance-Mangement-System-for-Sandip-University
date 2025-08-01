import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, students, divisionId } = body;

        if (!name || !students || !divisionId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const subDivision = await prisma.subDivision.update({
            where: { id: parseInt(id) },
            data: {
                name,
                students: parseInt(students),
                divisionId: parseInt(divisionId)
            },
            include: {
                division: {
                    include: {
                        department: true
                    }
                }
            }
        });

        return NextResponse.json(subDivision);
    } catch (error) {
        console.error('Error updating sub-division:', error);
        return NextResponse.json({ error: 'Failed to update sub-division' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.subDivision.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Sub-division deleted successfully' });
    } catch (error) {
        console.error('Error deleting sub-division:', error);
        return NextResponse.json({ error: 'Failed to delete sub-division' }, { status: 500 });
    }
} 
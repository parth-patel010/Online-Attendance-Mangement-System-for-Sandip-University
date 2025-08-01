import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const departmentId = searchParams.get('departmentId');

        if (!departmentId) {
            return NextResponse.json(
                { error: 'Department ID is required' },
                { status: 400 }
            );
        }

        const subjects = await prisma.subject.findMany({
            where: {
                departmentId: parseInt(departmentId),
            },
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(subjects);
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subjects' },
            { status: 500 }
        );
    }
} 
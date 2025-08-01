import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const faculty = await prisma.faculty.findMany({
            orderBy: {
                name: 'asc',
            },
        });

        return NextResponse.json(faculty);
    } catch (error) {
        console.error('Error fetching faculty:', error);
        return NextResponse.json(
            { error: 'Failed to fetch faculty' },
            { status: 500 }
        );
    }
} 
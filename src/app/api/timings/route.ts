import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const timings = await prisma.timing.findMany({
            orderBy: {
                id: 'asc',
            },
        });

        return NextResponse.json(timings);
    } catch (error) {
        console.error('Error fetching timings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch timings' },
            { status: 500 }
        );
    }
} 
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const timings = await prisma.timing.findMany({
            orderBy: {
                label: 'asc',
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { label } = body;

        if (!label) {
            return NextResponse.json(
                { error: 'Label is required' },
                { status: 400 }
            );
        }

        const timing = await prisma.timing.create({
            data: { label },
        });

        return NextResponse.json(timing, { status: 201 });
    } catch (error) {
        console.error('Error creating timing:', error);
        return NextResponse.json(
            { error: 'Failed to create timing' },
            { status: 500 }
        );
    }
} 
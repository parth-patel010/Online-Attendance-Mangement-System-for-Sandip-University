import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required' },
                { status: 400 }
            );
        }

        const faculty = await prisma.faculty.create({
            data: { name },
        });

        return NextResponse.json(faculty, { status: 201 });
    } catch (error) {
        console.error('Error creating faculty:', error);
        return NextResponse.json(
            { error: 'Failed to create faculty' },
            { status: 500 }
        );
    }
} 
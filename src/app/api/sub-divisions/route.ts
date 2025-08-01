import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const divisionId = searchParams.get('divisionId');

        if (divisionId) {
            const subDivisions = await prisma.subDivision.findMany({
                where: {
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
            return NextResponse.json(subDivisions);
        }

        const subDivisions = await prisma.subDivision.findMany({
            include: {
                division: {
                    include: {
                        department: true
                    }
                }
            }
        });
        return NextResponse.json(subDivisions);
    } catch (error) {
        console.error('Error fetching sub-divisions:', error);
        return NextResponse.json({ error: 'Failed to fetch sub-divisions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, students, divisionId } = body;

        if (!name || !students || !divisionId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const subDivision = await prisma.subDivision.create({
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
        console.error('Error creating sub-division:', error);
        return NextResponse.json({ error: 'Failed to create sub-division' }, { status: 500 });
    }
} 
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const divisions = await prisma.division.findMany({
            include: {
                department: true,
                subDivisions: true
            }
        });
        return NextResponse.json(divisions);
    } catch (error) {
        console.error('Error fetching divisions:', error);
        return NextResponse.json({ error: 'Failed to fetch divisions' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, totalStudents, departmentId } = body;

        if (!name || !totalStudents || !departmentId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const division = await prisma.division.create({
            data: {
                name,
                totalStudents: parseInt(totalStudents),
                departmentId: parseInt(departmentId)
            },
            include: {
                department: true,
                subDivisions: true
            }
        });

        return NextResponse.json(division);
    } catch (error) {
        console.error('Error creating division:', error);
        return NextResponse.json({ error: 'Failed to create division' }, { status: 500 });
    }
} 
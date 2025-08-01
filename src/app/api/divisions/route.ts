import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const departmentId = searchParams.get('departmentId');

        if (departmentId) {
            const divisions = await prisma.division.findMany({
                where: {
                    departmentId: parseInt(departmentId)
                },
                include: {
                    department: true,
                    subDivisions: true
                }
            });
            return NextResponse.json(divisions);
        }

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
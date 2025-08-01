import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hashed = await bcrypt.hash("codecrafters@123", 10);
    
    // Create admin user
    await prisma.admin.upsert({
        where: { email: "sandip_university@gmail.com" },
        update: {},
        create: {
            email: "sandip_university@gmail.com",
            password: hashed,
        },
    });

    // Create regular user
    await prisma.user.upsert({
        where: { email: "sandip_university@gmail.com" },
        update: {},
        create: {
            email: "sandip_university@gmail.com",
            password: hashed,
            name: "Sandip University User",
        },
    });

    // Seed some initial data
    const departments = await Promise.all([
        prisma.department.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Information Technology" },
                { name: "Mechanical Engineering" },
            ],
            skipDuplicates: true,
        }),
    ]);

    const computerScienceDept = await prisma.department.findFirst({
        where: { name: "Computer Science" },
    });

    const itDept = await prisma.department.findFirst({
        where: { name: "Information Technology" },
    });

    const mechDept = await prisma.department.findFirst({
        where: { name: "Mechanical Engineering" },
    });

    if (!computerScienceDept || !itDept || !mechDept) {
        throw new Error("Departments not found");
    }

    const divisions = await Promise.all([
        prisma.division.createMany({
            data: [
                { name: "A", departmentId: computerScienceDept.id, totalStudents: 75 },
                { name: "B", departmentId: computerScienceDept.id, totalStudents: 68 },
                { name: "A", departmentId: itDept.id, totalStudents: 82 },
                { name: "B", departmentId: itDept.id, totalStudents: 71 },
                { name: "A", departmentId: mechDept.id, totalStudents: 65 },
                { name: "B", departmentId: mechDept.id, totalStudents: 73 },
            ],
            skipDuplicates: true,
        }),
    ]);

    const subjects = await Promise.all([
        prisma.subject.createMany({
            data: [
                { name: "Data Structures", departmentId: computerScienceDept.id },
                { name: "Database Management", departmentId: computerScienceDept.id },
                { name: "Web Development", departmentId: computerScienceDept.id },
                { name: "Network Security", departmentId: itDept.id },
                { name: "Software Engineering", departmentId: itDept.id },
                { name: "Thermodynamics", departmentId: mechDept.id },
                { name: "Machine Design", departmentId: mechDept.id },
            ],
            skipDuplicates: true,
        }),
    ]);

    const faculty = await Promise.all([
        prisma.faculty.createMany({
            data: [
                { name: "Dr. John Smith" },
                { name: "Prof. Sarah Johnson" },
                { name: "Dr. Michael Brown" },
                { name: "Prof. Emily Davis" },
                { name: "Dr. Robert Wilson" },
            ],
            skipDuplicates: true,
        }),
    ]);

    const timings = await Promise.all([
        prisma.timing.createMany({
            data: [
                { label: "7:00 AM - 8:00 AM" },
                { label: "8:00 AM - 9:00 AM" },
                { label: "9:00 AM - 10:00 AM" },
                { label: "10:00 AM - 11:00 AM" },
                { label: "11:00 AM - 12:00 PM" },
                { label: "12:00 PM - 1:00 PM" },
                { label: "1:00 PM - 2:00 PM" },
                { label: "2:00 PM - 3:00 PM" },
            ],
            skipDuplicates: true,
        }),
    ]);

    console.log("Database seeded successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 
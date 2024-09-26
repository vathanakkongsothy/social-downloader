import { prisma } from "@/lib/db";
import bcrypt from 'bcrypt';

export const signUp = async (email: string, password: string) => {
    try {
        // Validate email and password
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User with this email already exists.');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        return user;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
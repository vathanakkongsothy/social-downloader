import { prisma } from "@/lib/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || "";
export const signIn = async (email: string, password: string) => {
    try {
        // Validate email and password
        if (!email || !password) {
            throw new Error('Email and password are required.');
        }

        // Find the user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new Error('Invalid email or password.');
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid email or password.');
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        return { user, token };
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : String(error));
    }
}
import { prisma } from "@/lib/db";
import bcrypt from 'bcrypt';

export const signIn = async (email: string, password: string) => {
    try {
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
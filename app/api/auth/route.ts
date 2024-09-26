import { NextResponse } from "next/server";
import { signUp } from "./signUp";
import { signIn } from "./signIn";

export async function POST(request: Request) {
    try {
        const { email, password, action } = await request.json();

        if (!email || !password || !action) {
            return new NextResponse('Email, password, and action are required.', {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        let user;
        if (action === 'signUp') {
            user = await signUp(email, password);
        } else if (action === 'signIn') {
            user = await signIn(email, password);
        } else {
            return new NextResponse('Invalid action.', {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }

        return new NextResponse(JSON.stringify(user), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
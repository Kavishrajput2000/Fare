import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // 1. Basic Validation
        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        await connectDb();

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 3. Compare password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 4. Create JWT Payload
        const tokenData = {
            id: user._id,
            name: user.name,
            email: user.email,
        };

        // 5. Generate Token
        // Make sure to add JWT_SECRET to your .env file
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, {
            expiresIn: "1d",
        });

        // 6. Return Response (User data + Token)
        return NextResponse.json(
            {
                message: `Welcome back ${user.name}`,
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                },
                token: token
            },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: `Login error: ${error.message}` },
            { status: 500 }
        );
    }
}
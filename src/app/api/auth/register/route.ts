import connectDb from "@/lib/db";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Helper to generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json();
        await connectDb();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: "Email already exists!" }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters!" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        // Create user with isVerified: false (Update your model to include these fields)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false 
        });

        // Configure Nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Account",
            html: `
                <div style="font-family: sans-serif; padding: 20px; background: #f4f4f4;">
                    <h2>Welcome to the platform!</h2>
                    <p>Your 6-digit verification code is:</p>
                    <h1 style="color: #fbbf24; letter-spacing: 5px;">${otp}</h1>
                    <p>This code expires in 10 minutes.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: "OTP sent to email", userId: user._id },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: `Register error: ${error}` },
            { status: 500 }
        );
    }
}
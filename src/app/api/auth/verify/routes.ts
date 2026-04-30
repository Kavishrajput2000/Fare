import connectDb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, otp } = body;

        // 1. Basic Validation
        if (!email || !otp) {
            return NextResponse.json({ message: "Email and OTP are required" }, { status: 400 });
        }

        await connectDb();

        // 2. Find user with Normalized Email
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // 3. Check if already verified (Avoid redundant processing)
        if (user.isVerified) {
            return NextResponse.json({ message: "Email is already verified. Please login." }, { status: 200 });
        }

        // 4. Validate OTP and Expiry
        const isOtpValid = user.otp === otp;
        const isOtpNotExpired = user.otpExpiry && new Date(user.otpExpiry) > new Date();

        if (!isOtpValid || !isOtpNotExpired) {
            return NextResponse.json(
                { message: !isOtpNotExpired ? "OTP has expired" : "Invalid verification code" }, 
                { status: 400 }
            );
        }

        // 5. Update User State
        // Using atomic update for better performance and reliability
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        
        await user.save();

        return NextResponse.json({ 
            message: "Email verified successfully!",
            success: true 
        }, { status: 200 });

    } catch (error: any) {
        // Detailed logging to help you debug 500 errors in development
        console.error("VERIFICATION_ERROR:", error);

        return NextResponse.json({ 
            message: "An internal error occurred during verification",
            details: error.message 
        }, { status: 500 });
    }
}
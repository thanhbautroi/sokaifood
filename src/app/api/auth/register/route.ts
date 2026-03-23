import User from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ message: "Vui lòng điền đầy đủ thông tin" }, { status: 400 });
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ message: "Email này đã được sử dụng" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user",
        });

        return NextResponse.json({ message: "Đăng ký thành công!", user: newUser }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Đã xảy ra lỗi" }, { status: 500 });
    }
}

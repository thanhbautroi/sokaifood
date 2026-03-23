import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET current user profile
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById((session.user as any).id).select("-password").lean();

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
}

// PUT update user profile
export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, phone, address, currentPassword, newPassword } = await req.json();

    await dbConnect();
    const user = await User.findById((session.user as any).id);

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update basic info
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;

    // Update password if requested
    if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password || "");
        if (!isMatch) {
            return NextResponse.json({ message: "Mật khẩu hiện tại không đúng" }, { status: 400 });
        }
        user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();

    return NextResponse.json({ message: "Cập nhật thành công" }, { status: 200 });
}

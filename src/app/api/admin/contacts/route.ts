import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

// GET: list all contacts (admin only)
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ contacts });
}

// POST: submit a contact message (public)
export async function POST(req: Request) {
    const { name, email, phone, message } = await req.json();
    if (!name || !email || !message) {
        return NextResponse.json({ message: "Thiếu thông tin bắt buộc" }, { status: 400 });
    }
    await dbConnect();
    const contact = await Contact.create({ name, email, phone, message });
    return NextResponse.json({ message: "Gửi thành công!", contact }, { status: 201 });
}

// PATCH: mark as read
export async function PATCH(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await req.json();
    await dbConnect();
    await Contact.findByIdAndUpdate(id, { read: true });
    return NextResponse.json({ message: "Marked as read" });
}

// DELETE
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Missing id" }, { status: 400 });
    await dbConnect();
    await Contact.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
}

import Order from "@/models/Order";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        if (!body.items || body.items.length === 0) {
            return NextResponse.json({ message: "Giỏ hàng rỗng" }, { status: 400 });
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        const newOrder = await Order.create({
            userId: session?.user ? (session.user as any).id : null,
            items: body.items.map((item: any) => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
            })),
            guestInfo: body.guestInfo,
            totalAmount: body.totalAmount,
            paymentMethod: body.paymentMethod,
            status: "pending",
            paymentStatus: "pending",
            notes: body.guestInfo?.notes,
        });

        return NextResponse.json({ message: "Đặt hàng thành công", orderId: newOrder._id }, { status: 201 });
    } catch (error: any) {
        console.error("Order Creation Error:", error);
        return NextResponse.json({ message: "Lỗi hệ thống khi tạo đơn hàng" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        // Default to admin fetching all if query param specified, else user's orders
        const { searchParams } = new URL(req.url);
        const all = searchParams.get("all") === "true";

        if (all && (session?.user as any)?.role === "admin") {
            const orders = await Order.find().sort({ createdAt: -1 });
            return NextResponse.json({ orders }, { status: 200 });
        }

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const orders = await Order.find({ userId: (session.user as any).id }).sort({ createdAt: -1 });

        return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Lỗi hệ thống khi lấy đơn hàng" }, { status: 500 });
    }
}

import Order from "@/models/Order";
import Product from "@/models/Product";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();

        if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
            return NextResponse.json({ message: "Giỏ hàng rỗng." }, { status: 400 });
        }

        if (typeof body.totalAmount !== "number" || body.totalAmount < 0) {
            return NextResponse.json({ message: "Tổng tiền đơn hàng không hợp lệ." }, { status: 400 });
        }

        if (!body.guestInfo || !body.guestInfo.name || !body.guestInfo.phone || !body.guestInfo.address) {
            return NextResponse.json({ message: "Vui lòng cung cấp tên, số điện thoại và địa chỉ giao hàng." }, { status: 400 });
        }

        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI!);
        }

        const mappedItems = body.items.map((item: any) => {
            const productId = item.productId || item._id;
            return {
                productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || "/logo.png",
            };
        });

        if (mappedItems.some((item: any) => !item.productId)) {
            return NextResponse.json({ message: "Mã sản phẩm không hợp lệ trong giỏ hàng." }, { status: 400 });
        }

        const productIds = mappedItems.map((item: any) => item.productId);
        const products = await Product.find({ _id: { $in: productIds } }).lean();
        const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

        for (const item of mappedItems) {
            const product = productMap.get(item.productId.toString());
            if (!product) {
                return NextResponse.json({ message: `Sản phẩm không tồn tại: ${item.name}` }, { status: 400 });
            }
            if (!product.inStock || typeof product.quantity !== "number" || product.quantity <= 0) {
                return NextResponse.json({ message: `Sản phẩm ${product.name} hiện đã hết hàng.` }, { status: 400 });
            }
            if (typeof item.quantity !== "number" || item.quantity <= 0) {
                return NextResponse.json({ message: `Số lượng không hợp lệ cho sản phẩm ${product.name}.` }, { status: 400 });
            }
            if (typeof product.quantity === "number" && item.quantity > product.quantity) {
                return NextResponse.json({ message: `Sản phẩm ${product.name} chỉ còn ${product.quantity} sản phẩm trong kho.` }, { status: 400 });
            }
        }

        const newOrder = await Order.create({
            userId: session?.user ? (session.user as any).id : null,
            items: mappedItems,
            guestInfo: {
                name: body.guestInfo.name,
                email: body.guestInfo.email || "",
                phone: body.guestInfo.phone,
                address: body.guestInfo.address,
            },
            totalAmount: body.totalAmount,
            paymentMethod: body.paymentMethod || "cod",
            status: "pending",
            paymentStatus: "pending",
            notes: body.guestInfo?.notes,
        });

        // Update product quantities after successful order creation
        for (const item of mappedItems) {
            const product = productMap.get(item.productId.toString());
            if (product && typeof product.quantity === "number") {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { quantity: -item.quantity } }
                );
            }
        }

        return NextResponse.json({ message: "Đặt hàng thành công", orderId: newOrder._id }, { status: 201 });
    } catch (error: any) {
        console.error("Order Creation Error:", error);
        if (error.name === "ValidationError") {
            return NextResponse.json({ message: error.message }, { status: 400 });
        }
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

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Contact from "@/models/Contact";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Total orders and revenue
    const orders = await Order.find({}).lean();
    const totalOrders = orders.length;
    const totalRevenue = orders
        .filter((o: any) => o.status !== "cancelled")
        .reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

    const pendingOrders = orders.filter((o: any) => o.status === "pending").length;

    // Users count
    const totalUsers = await User.countDocuments({});

    // Unread contacts
    const unreadContacts = await Contact.countDocuments({ read: false });

    // Revenue by day (last 7 days)
    const now = new Date();
    const revenueByDay = [];
    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        day.setHours(0, 0, 0, 0);
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);

        const dayOrders = orders.filter((o: any) => {
            const d = new Date(o.createdAt);
            return d >= day && d < nextDay && o.status !== "cancelled";
        });
        const dayRevenue = dayOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

        revenueByDay.push({
            date: day.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
            revenue: dayRevenue,
            orders: dayOrders.length,
        });
    }

    // Recent orders (last 5)
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    // Order status breakdowns
    const statusBreakdown = {
        pending: orders.filter((o: any) => o.status === "pending").length,
        processing: orders.filter((o: any) => o.status === "processing").length,
        shipped: orders.filter((o: any) => o.status === "shipped").length,
        delivered: orders.filter((o: any) => o.status === "delivered").length,
        cancelled: orders.filter((o: any) => o.status === "cancelled").length,
    };

    return NextResponse.json({
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalUsers,
        unreadContacts,
        revenueByDay,
        recentOrders,
        statusBreakdown,
    });
}

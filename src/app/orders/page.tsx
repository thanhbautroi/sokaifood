"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ArrowLeft, Clock, Package, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Order {
    _id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
    items: {
        name: string;
        image: string;
        quantity: number;
        price: number;
    }[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "pending": return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-sm font-medium border border-amber-200"><Clock className="w-4 h-4" /> Chờ xác nhận</span>;
        case "processing": return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium border border-blue-200"><Package className="w-4 h-4" /> Đang chuẩn bị</span>;
        case "shipped": return <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-medium border border-purple-200"><Package className="w-4 h-4" /> Đang giao</span>;
        case "delivered": return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-medium border border-green-200"><CheckCircle2 className="w-4 h-4" /> Đã giao</span>;
        case "cancelled": return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-200"><XCircle className="w-4 h-4" /> Đã huỷ</span>;
        default: return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">{status}</span>;
    }
};

export default function UserOrdersPage() {
    const { data: session, status } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/orders")
                .then(res => res.json())
                .then(data => {
                    setOrders(data.orders || []);
                    setIsLoading(false);
                })
                .catch(() => setIsLoading(false));
        } else if (status === "unauthenticated") {
            setIsLoading(false);
        }
    }, [status]);

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-[70vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 pt-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Bạn chưa đăng nhập</h2>
                <p className="text-gray-500 mb-8 max-w-sm">Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.</p>
                <Link href="/login" className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors">Đăng nhập ngay</Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 max-w-5xl pt-32 pb-16 min-h-screen">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 font-medium mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Tiếp tục mua sắm
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Đơn hàng của tôi</h1>

            {orders.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-500 mb-6">Bạn chưa đặt món ăn vặt nào từ Skyfood. Khám phá ngay!</p>
                    <Link href="/" className="inline-block bg-red-50 text-red-700 px-6 py-2.5 rounded-full font-bold hover:bg-red-100 transition-colors">Bắt đầu mua sắm</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Mã đơn hàng: <span className="font-mono text-gray-900 font-medium">#{order._id.slice(-8).toUpperCase()}</span></p>
                                    <p className="text-sm text-gray-500">Ngày đặt: <span className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span></p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                    {getStatusBadge(order.status)}
                                    <div className="text-right sm:text-left w-full sm:w-auto">
                                        <p className="text-sm text-gray-500">Tổng tiền</p>
                                        <p className="font-bold text-red-700 text-lg">{order.totalAmount.toLocaleString("vi-VN")}₫</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 sm:p-6 space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 relative bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                                            <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">Số lượng: {item.quantity}</p>
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

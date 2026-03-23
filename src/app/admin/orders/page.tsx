"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Package, Eye } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/orders?all=true");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            // In real scenario, make a PUT request to /api/orders/[id]
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                // Update local state instead of refetching for speed
                setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert("Lỗi khi cập nhật trạng thái");
            }
        } catch (error) {
            alert("Lỗi hệ thống");
        }
    };

    if (isLoading) {
        return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-4 border-red-200 border-t-red-500 animate-spin"></div></div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-6 tracking-tight">Quản lý Đơn hàng</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-sm tracking-wider uppercase">
                                <th className="p-4 font-semibold">Mã ĐH</th>
                                <th className="p-4 font-semibold">Khách hàng</th>
                                <th className="p-4 font-semibold">Ngày đặt</th>
                                <th className="p-4 font-semibold">Tổng tiền</th>
                                <th className="p-4 font-semibold">Trạng thái</th>
                                <th className="p-4 font-semibold text-center">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">Chưa có đơn hàng nào trong hệ thống.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-mono text-sm font-medium text-slate-900">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-900">{order.guestInfo?.name || "Khách"}</div>
                                            <div className="text-xs text-slate-500">{order.guestInfo?.phone || ""}</div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-4 font-bold text-red-700">
                                            {order.totalAmount.toLocaleString("vi-VN")}₫
                                        </td>
                                        <td className="p-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                                                className={`text-sm px-3 py-1.5 rounded-lg border outline-none font-medium ${order.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                            order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                                order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    'bg-red-50 text-red-700 border-red-200'
                                                    }`}
                                            >
                                                <option value="pending">Chờ xử lý</option>
                                                <option value="processing">Đang đóng gói</option>
                                                <option value="shipped">Đang giao hàng</option>
                                                <option value="delivered">Đã giao hàng</option>
                                                <option value="cancelled">Đã huỷ</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg hover:shadow-sm" title="Xem chi tiết">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

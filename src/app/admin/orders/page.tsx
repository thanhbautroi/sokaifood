"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Package, Eye } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

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
                if (selectedOrder?._id === orderId) {
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                }
            } else {
                alert("Lỗi khi cập nhật trạng thái");
            }
        } catch (error) {
            alert("Lỗi hệ thống");
        }
    };

    const handleViewOrder = (order: any) => {
        setSelectedOrder(order);
    };

    const closeOrderModal = () => {
        setSelectedOrder(null);
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
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-lg hover:shadow-sm"
                                                title="Xem chi tiết"
                                            >
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

            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Chi tiết đơn hàng</h2>
                                <p className="text-sm text-slate-500">Mã đơn: #{selectedOrder._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button onClick={closeOrderModal} className="text-slate-500 hover:text-slate-900">Đóng</button>
                        </div>

                        <div className="px-6 py-5 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Thông tin khách hàng</h3>
                                    <p className="text-sm text-slate-900 font-medium">{selectedOrder.guestInfo?.name || 'Khách'}</p>
                                    <p className="text-sm text-slate-500">{selectedOrder.guestInfo?.phone || '-'}</p>
                                    <p className="mt-3 text-sm text-slate-600">{selectedOrder.guestInfo?.address || '-'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Thông tin đơn hàng</h3>
                                    <p className="text-sm text-slate-500">Thanh toán: <span className="font-medium text-slate-900">{selectedOrder.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'COD'}</span></p>
                                    <p className="text-sm text-slate-500">Trạng thái: <span className="font-medium text-slate-900">{selectedOrder.status}</span></p>
                                    <p className="text-sm text-slate-500">Tổng tiền: <span className="font-semibold text-red-700">{selectedOrder.totalAmount.toLocaleString('vi-VN')}₫</span></p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-slate-700 mb-4">Sản phẩm trong đơn</h3>
                                <div className="overflow-x-auto rounded-3xl border border-slate-200">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-50 text-slate-500 uppercase tracking-wide text-xs">
                                            <tr>
                                                <th className="px-4 py-3">Sản phẩm</th>
                                                <th className="px-4 py-3">Số lượng</th>
                                                <th className="px-4 py-3">Đơn giá</th>
                                                <th className="px-4 py-3">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {selectedOrder.items.map((item: any) => (
                                                <tr key={`${item.productId}-${item.name}`}>
                                                    <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                                                    <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-slate-600">{item.price.toLocaleString('vi-VN')}₫</td>
                                                    <td className="px-4 py-3 text-slate-900 font-semibold">{(item.quantity * item.price).toLocaleString('vi-VN')}₫</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

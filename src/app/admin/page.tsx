"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp, ShoppingCart, Users, Clock, MessageCircle,
  Package, CheckCircle2, XCircle, Truck, RefreshCw
} from "lucide-react";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  totalUsers: number;
  unreadContacts: number;
  revenueByDay: { date: string; revenue: number; orders: number }[];
  recentOrders: any[];
  statusBreakdown: { pending: number; processing: number; shipped: number; delivered: number; cancelled: number };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-700", icon: Package },
  shipped: { label: "Đang giao", color: "bg-purple-100 text-purple-700", icon: Truck },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-600", icon: XCircle },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    setRefreshing(true);
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      const data = await res.json();
      setStats(data);
    }
    setRefreshing(false);
    setLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-24 text-gray-400">
      <RefreshCw className="w-8 h-8 animate-spin" />
    </div>
  );

  const maxRevenue = Math.max(...(stats?.revenueByDay.map(d => d.revenue) ?? [1]), 1);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan Hệ thống</h1>
          <p className="text-sm text-gray-500 mt-1">Cập nhật theo thời gian thực</p>
        </div>
        <button onClick={fetchStats} disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Doanh thu", value: `${(stats?.totalRevenue ?? 0).toLocaleString("vi-VN")}đ`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Tổng đơn hàng", value: stats?.totalOrders ?? 0, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Chờ xử lý", value: stats?.pendingOrders ?? 0, icon: Clock, color: "text-red-700", bg: "bg-red-50" },
          { label: "Khách hàng", value: stats?.totalUsers ?? 0, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-xs text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-6">Doanh thu 7 ngày gần nhất</h3>
          <div className="flex items-end gap-2 h-40">
            {stats?.revenueByDay.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end justify-center" style={{ height: "120px" }}>
                  <div
                    className="w-full bg-red-500 rounded-t-lg hover:bg-red-700 transition-colors relative group"
                    style={{ height: `${Math.max((day.revenue / maxRevenue) * 100, 4)}%` }}
                    title={`${day.revenue.toLocaleString("vi-VN")}đ`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {day.revenue.toLocaleString("vi-VN")}đ
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{day.date}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex gap-6 text-sm text-gray-600">
            <div>Tổng 7 ngày: <strong className="text-gray-900">{(stats?.revenueByDay.reduce((s, d) => s + d.revenue, 0) ?? 0).toLocaleString("vi-VN")}đ</strong></div>
            <div>Đơn: <strong className="text-gray-900">{stats?.revenueByDay.reduce((s, d) => s + d.orders, 0) ?? 0}</strong></div>
          </div>
        </div>

        {/* Order Status + Contacts notification */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
            <div className="space-y-2">
              {Object.entries(stats?.statusBreakdown ?? {}).map(([key, count]) => {
                const cfg = STATUS_CONFIG[key];
                if (!cfg) return null;
                const Icon = cfg.icon;
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unread contacts alert */}
          {(stats?.unreadContacts ?? 0) > 0 && (
            <Link href="/admin/contacts"
              className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 hover:bg-red-100 transition-colors group">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-red-700 text-sm">{stats?.unreadContacts} tin nhắn chưa đọc</p>
                <p className="text-xs text-red-500">Nhấn để xem liên hệ</p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Đơn hàng gần đây</h3>
          <Link href="/admin/orders" className="text-sm text-red-500 hover:underline font-medium">Xem tất cả</Link>
        </div>
        {(stats?.recentOrders?.length ?? 0) === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p>Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentOrders?.map((order: any) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                const name = order.guestInfo?.name || order.userId?.name || "Khách";
                return (
                  <tr key={order._id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-3 text-xs font-mono text-gray-500">{order._id?.toString().slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{name}</td>
                    <td className="px-6 py-3 text-sm font-bold text-red-700">{(order.totalAmount ?? 0).toLocaleString("vi-VN")}đ</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${cfg.color}`}>
                        <Icon className="w-3 h-3" />{cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 pt-24">
                <div className="w-24 h-24 bg-red-100 rounded-full flex justify-center items-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng của bạn đang trống</h2>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Có vẻ như bạn chưa chọn món đồ ăn vặt nào. Khám phá ngay hàng ngàn món ngon tại Skyfood!
                </p>
                <Link
                    href="/"
                    className="bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition-colors"
                >
                    Tiếp tục mua hàng
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 max-w-6xl pt-32 pb-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Giỏ hàng ({items.length} sản phẩm)</h1>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 space-y-4">
                    {items.map((item) => (
                        <div key={item._id} className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative pr-10 hover:shadow-md transition-shadow">
                            <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-gray-50 shrink-0">
                                <Image
                                    src={item.image || "/images/placeholder.jpg"}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{item.name}</h3>
                                <p className="text-red-700 font-bold mb-3">{item.price.toLocaleString("vi-VN")}₫</p>
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-red-500 hover:shadow-sm transition-all"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-red-500 hover:shadow-sm transition-all"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => removeItem(item._id)}
                                className="absolute top-4 right-4 sm:static w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="w-full lg:w-[380px] shrink-0">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span className="font-medium text-gray-900">{getTotalPrice().toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-gray-900">Tính khi thanh toán</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                <span className="text-gray-900 font-bold text-base">Tổng cộng</span>
                                <span className="text-2xl font-bold text-red-500">{getTotalPrice().toLocaleString("vi-VN")}₫</span>
                            </div>
                        </div>
                        <Link
                            href="/checkout"
                            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 hover:shadow-lg transition-all"
                        >
                            Tiến hành thanh toán
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

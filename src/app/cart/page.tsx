"use client";

import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const { items, updateQuantity, removeItem, getTotalPrice, toggleItemSelection, selectAllItems, deselectAllItems, getSelectedPrice, getSelectedItems } = useCartStore();
    const selectedItems = getSelectedItems();
    const selectedCount = selectedItems.length;
    const allSelected = items.length > 0 && selectedCount === items.length;

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
                <div className="flex-1">
                    {/* Select all bar */}
                    <div className="mb-4 flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                        <input
                            type="checkbox"
                            checked={allSelected && items.length > 0}
                            onChange={allSelected ? deselectAllItems : selectAllItems}
                            className="w-5 h-5 rounded border-gray-300 text-red-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700">
                            {selectedCount > 0 ? `Đã chọn ${selectedCount}/${items.length}` : "Chọn tất cả"}
                        </span>
                    </div>
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div 
                                key={item._id} 
                                className={`flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border shadow-sm relative pr-10 hover:shadow-md transition-all cursor-pointer ${
                                    item.selected ? "bg-red-50 border-red-200" : "bg-white border-gray-100"
                                }`}
                                onClick={() => toggleItemSelection(item._id)}
                            >
                                <input
                                    type="checkbox"
                                    checked={item.selected ?? false}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        toggleItemSelection(item._id);
                                    }}
                                    className="w-5 h-5 rounded border-gray-300 text-red-500 cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                />
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item._id, item.quantity - 1);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-red-500 hover:shadow-sm transition-all"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    updateQuantity(item._id, item.quantity + 1);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white hover:text-red-500 hover:shadow-sm transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeItem(item._id);
                                    }}
                                    className="absolute top-4 right-4 sm:static w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-[380px] shrink-0">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
                        <div className="space-y-4 text-sm mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Tạm tính</span>
                                <span className="font-medium text-gray-900">{getSelectedPrice().toLocaleString("vi-VN")}₫</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-gray-900">Tính khi thanh toán</span>
                            </div>
                            <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                                <span className="text-gray-900 font-bold text-base">Tổng cộng</span>
                                <span className="text-2xl font-bold text-red-500">{getSelectedPrice().toLocaleString("vi-VN")}₫</span>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push("/checkout")}
                            disabled={selectedCount === 0}
                            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Tiến hành thanh toán
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

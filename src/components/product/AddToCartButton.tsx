"use client";

import { useState } from "react";
import {
    ShoppingBag, CheckCircle2, X, LogIn, User, Phone, MapPin,
    ArrowLeft, ShoppingCart, Zap
} from "lucide-react";
import { FiPackage } from "react-icons/fi";
import { MdOutlineVerified, MdDeliveryDining } from "react-icons/md";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Product = {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    inStock: boolean;
    quantity?: number;
};

type GuestForm = {
    name: string;
    phone: string;
    address: string;
};

type ModalIntent = "buy_now" | "add_cart";

export default function AddToCartButton({ product }: { product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);
    const { data: session, status } = useSession();
    const router = useRouter();

    const [addedToCart, setAddedToCart] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [cartError, setCartError] = useState("");
    const [modalIntent, setModalIntent] = useState<ModalIntent>("add_cart");
    const [mode, setMode] = useState<"choose" | "guest">("choose");
    const [guestForm, setGuestForm] = useState<GuestForm>({ name: "", phone: "", address: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [guestSuccess, setGuestSuccess] = useState(false);

    const availableStock = typeof product.quantity === "number" ? product.quantity : 0;
    const currentQuantityInCart = items.find((i) => i._id === product._id)?.quantity || 0;
    const buyNowDisabled = !product.inStock || availableStock <= 0;
    const addToCartDisabled = !product.inStock || availableStock <= 0;
    const buyNowClasses = "flex-1 flex items-center justify-center gap-2 py-4 bg-red-500 text-white rounded-full font-bold text-base transition-all shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-500/50 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed";
    const addButtonClasses = addedToCart
        ? "flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all border-2 bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        : "flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-bold text-base transition-all border-2 bg-white border-red-500 text-red-500 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed";

    const validateStock = (additionalQuantity: number) => {
        if (currentQuantityInCart + additionalQuantity > availableStock) {
            const remaining = Math.max(availableStock - currentQuantityInCart, 0);
            setCartError(
                remaining > 0
                    ? `Chỉ còn ${remaining} sản phẩm trong kho. Vui lòng giảm số lượng hoặc chọn sản phẩm khác.`
                    : "Sản phẩm đã hết hàng hoặc đã đạt giới hạn tồn kho."
            );
            return false;
        }
        setCartError("");
        return true;
    };

    const doAddToCart = () => {
        if (!validateStock(1)) return;

        addItem({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "",
            slug: product.slug,
            stock: product.quantity,
        });
    };

    // "Mua ngay" button
    const handleBuyNow = () => {
        if (buyNowDisabled) return;
        if (!validateStock(1)) return;
        doAddToCart();
        router.push("/cart");
    };

    // "Thêm vào giỏ" button
    const handleAddToCart = () => {
        if (addToCartDisabled) return;
        if (!validateStock(1)) return;
        if (status === "authenticated") {
            doAddToCart();
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2500);
        } else {
            setModalIntent("add_cart");
            setMode("choose");
            setShowModal(true);
        }
    };

    const handleLoginAndCart = () => {
        doAddToCart();
        router.push("/cart");
    };

    const validateGuestForm = () => {
        const name = guestForm.name.trim();
        const phone = guestForm.phone.trim();
        const address = guestForm.address.trim();

        if (name.length < 2) return "Tên phải có ít nhất 2 ký tự.";
        if (!/^(0|\+84)\d{8,9}$/.test(phone.replace(/\s/g, ""))) return "Số điện thoại không hợp lệ.";
        if (address.length < 10) return "Địa chỉ cần chi tiết hơn (ít nhất 10 ký tự).";
        return null;
    };

    const handleGuestOrder = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateGuestForm();
        if (validationError) {
            alert(validationError);
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: [{
                        productId: product._id,
                        name: product.name,
                        price: product.price,
                        quantity: 1,
                        image: product.images?.[0] || "/logo.png",
                    }],
                    totalAmount: product.price,
                    guestInfo: {
                        name: guestForm.name.trim(),
                        phone: guestForm.phone.trim(),
                        address: guestForm.address.trim(),
                        email: "",
                        notes: `Đặt nhanh từ trang sản phẩm: ${product.name}`,
                    },
                    paymentMethod: "cod",
                }),
            });

            if (res.ok) {
                setGuestSuccess(true);
            } else {
                const errorData = await res.json().catch(() => null);
                alert(errorData?.message || "Có lỗi khi tạo đơn hàng, vui lòng thử lại.");
            }
        } catch {
            alert("Lỗi hệ thống, thử lại sau nhé!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setGuestSuccess(false);
        setGuestForm({ name: "", phone: "", address: "" });
    };

    return (
        <>
            {/* Two separate buttons */}
            <div className="flex gap-3 flex-col">
                {cartError && (
                    <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                        {cartError}
                    </div>
                )}
                <div className="flex gap-3">
                {/* Buy Now */}
                <button
                    onClick={handleBuyNow}
                    disabled={buyNowDisabled}
                    className={buyNowClasses}
                >
                    <Zap className="w-5 h-5" />
                    Mua ngay
                </button>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    disabled={addToCartDisabled}
                    className={addButtonClasses}
                >
                    {addedToCart ? (
                        <>
                            <CheckCircle2 className="w-5 h-5" />
                            Đã thêm!
                        </>
                    ) : (
                        <>
                            <ShoppingBag className="w-5 h-5" />
                            Thêm vào giỏ
                        </>
                    )}
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-500 to-amber-400 px-6 py-5 flex justify-between items-center">
                            <div>
                                <h3 className="text-white font-bold text-xl flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    {modalIntent === "buy_now" ? "Mua ngay" : "Thêm vào giỏ hàng"}
                                </h3>
                                <p className="text-red-100 text-sm mt-0.5 line-clamp-1">{product.name}</p>
                            </div>
                            <button onClick={closeModal} className="text-white hover:text-red-200 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {!guestSuccess ? (
                                <>
                                    {mode === "choose" && (
                                        <div className="space-y-4">
                                            <p className="text-gray-600 text-center text-sm font-medium">Bạn muốn tiếp tục bằng cách nào?</p>

                                            {/* Option A: Login */}
                                            <button
                                                onClick={handleLoginAndCart}
                                                className="flex items-center gap-4 w-full p-4 border-2 border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-400 transition-all group"
                                            >
                                                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors flex-shrink-0">
                                                    <LogIn className="w-6 h-6 text-red-700" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-gray-900">Đăng nhập / Đăng ký</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                        <MdOutlineVerified className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                                        Theo dõi đơn hàng, nhận ưu đãi thành viên
                                                    </p>
                                                </div>
                                            </button>

                                            {/* Option B: Guest order */}
                                            <button
                                                onClick={() => setMode("guest")}
                                                className="flex items-center gap-4 w-full p-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-400 transition-all group"
                                            >
                                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-colors flex-shrink-0">
                                                    <FiPackage className="w-6 h-6 text-gray-600" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold text-gray-900">Đặt hàng nhanh không cần tài khoản</p>
                                                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                                        <MdDeliveryDining className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                                                        Chỉ nhập tên, SĐT, địa chỉ là xong
                                                    </p>
                                                </div>
                                            </button>
                                        </div>
                                    )}

                                    {mode === "guest" && (
                                        <form onSubmit={handleGuestOrder} className="space-y-4">
                                            <p className="text-gray-600 text-sm text-center font-medium">Điền thông tin để chúng mình giao hàng</p>

                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Tên của bạn"
                                                    value={guestForm.name}
                                                    onChange={(e) => setGuestForm(p => ({ ...p, name: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                                />
                                            </div>

                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    required
                                                    type="tel"
                                                    placeholder="Số điện thoại liên lạc"
                                                    value={guestForm.phone}
                                                    onChange={(e) => setGuestForm(p => ({ ...p, phone: e.target.value }))}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                                />
                                            </div>

                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                                <textarea
                                                    required
                                                    placeholder="Địa chỉ giao hàng chi tiết (số nhà, đường, quận, thành phố)"
                                                    value={guestForm.address}
                                                    onChange={(e) => setGuestForm(p => ({ ...p, address: e.target.value }))}
                                                    rows={2}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm resize-none"
                                                />
                                            </div>

                                            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-900 flex items-center gap-2">
                                                <MdDeliveryDining className="w-5 h-5 text-red-500 flex-shrink-0" />
                                                <span>
                                                    <strong>Thanh toán khi nhận hàng (COD)</strong> — Tổng:{" "}
                                                    <strong>{product.price.toLocaleString("vi-VN")}đ</strong>
                                                </span>
                                            </div>

                                            <div className="flex gap-3">
                                                <button type="button" onClick={() => setMode("choose")}
                                                    className="flex items-center gap-1.5 justify-center flex-1 py-3 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm">
                                                    <ArrowLeft className="w-4 h-4" />
                                                    Quay lại
                                                </button>
                                                <button type="submit" disabled={isSubmitting}
                                                    className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-700 transition-colors text-sm disabled:opacity-60 shadow-lg shadow-red-500/30">
                                                    {isSubmitting ? "Đang đặt..." : "Xác nhận đặt hàng"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h3>
                                    <p className="text-gray-500 text-sm mb-6">
                                        Cảm ơn <strong>{guestForm.name}</strong>! Skyfood sẽ liên hệ số{" "}
                                        <strong>{guestForm.phone}</strong> để xác nhận đơn nhé.
                                    </p>
                                    <button
                                        onClick={closeModal}
                                        className="px-8 py-3 bg-red-500 text-white rounded-full font-bold hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}

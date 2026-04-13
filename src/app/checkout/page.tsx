"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    CheckCircle2, ArrowLeft, Copy, Package, ShoppingBag,
    AlertCircle, Phone, User, Mail, MapPin, ClipboardList
} from "lucide-react";
import { MdOutlinePayment } from "react-icons/md";
import { BsCashStack } from "react-icons/bs";

// --- Toast Component ---
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className={`fixed top-24 right-4 z-[300] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl font-medium text-sm max-w-sm animate-in slide-in-from-right-4
      ${type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {type === "success" ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {message}
        </div>
    );
}

function validate(formData: Record<string, string>) {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) errors.name = "Họ và tên ít nhất 2 ký tự";
    if (!/^(0|\+84)[0-9]{8,9}$/.test(formData.phone.replace(/\s/g, "")))
        errors.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email))
        errors.email = "Email không hợp lệ";
    if (!formData.address.trim() || formData.address.trim().length < 10)
        errors.address = "Địa chỉ cần chi tiết hơn (ít nhất 10 ký tự)";
    return errors;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { items, getSelectedItems, getTotalPrice, getSelectedPrice, clearCart } = useCartStore();
    const selectedItems = getSelectedItems();

    // Redirect to cart if no items selected
    useEffect(() => {
        if (items.length > 0 && selectedItems.length === 0) {
            router.push("/cart");
        }
    }, [items.length, selectedItems.length, router]);

    const [formData, setFormData] = useState({
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        phone: "",
        address: "",
        notes: "",
        paymentMethod: "cod",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successData, setSuccessData] = useState<{
        orderId: string;
        paymentMethod: string;
        amount?: number;
        qrUrl?: string;
        qrDescription?: string;
    } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [copied, setCopied] = useState(false);

    // Load saved user info on mount
    useEffect(() => {
        const loadSavedInfo = async () => {
            if (session?.user) {
                // Load from API if user is logged in
                try {
                    const res = await fetch("/api/profile");
                    if (res.ok) {
                        const data = await res.json();
                        setFormData(prev => ({
                            ...prev,
                            phone: data.user?.phone || "",
                            address: data.user?.address || "",
                        }));
                    }
                } catch (err) {
                    console.error("Failed to load user info:", err);
                }
            } else {
                // Load from localStorage if guest
                const savedPhoneLocal = localStorage.getItem("guestPhone") || "";
                const savedAddressLocal = localStorage.getItem("guestAddress") || "";
                setFormData(prev => ({
                    ...prev,
                    phone: savedPhoneLocal,
                    address: savedAddressLocal,
                }));
            }
        };
        loadSavedInfo();
    }, [session]);

    const showToast = (message: string, type: "success" | "error") => {
        setToast({ message, type });
    };

    const buildBankTransferPopupHtml = (qrUrl: string, amount: number, description: string, orderId: string) => {
        const formattedAmount = amount.toLocaleString("vi-VN");
        return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<title>Thông tin chuyển khoản</title>
<style>
  body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f4f7fb; color: #111827; }
  .card { max-width: 520px; margin: 32px auto; padding: 24px; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 50px rgba(15,23,42,0.08); }
  .title { display: flex; align-items: center; gap: 10px; font-size: 20px; font-weight: 700; color: #1e3a8a; margin-bottom: 18px; }
  .qr { width: 100%; max-width: 320px; border-radius: 24px; overflow: hidden; margin: 0 auto 22px; border: 1px solid #e2e8f0; }
  .row { display: flex; justify-content: space-between; gap: 12px; margin-bottom: 12px; font-size: 15px; }
  .label { color: #6b7280; }
  .value { font-weight: 700; color: #111827; text-align: right; }
  .amount { color: #b91c1c; }
  .note { margin-top: 14px; color: #475569; font-size: 13px; }
</style>
</head>
<body>
<div class="card">
  <div class="title">Thông tin chuyển khoản</div>
  <div class="qr"><img src="${qrUrl}" alt="QR chuyển khoản" style="display:block;width:100%;height:auto;" /></div>
  <div class="row"><span class="label">Ngân hàng:</span><span class="value">MB Bank</span></div>
  <div class="row"><span class="label">Số tài khoản:</span><span class="value">078911111</span></div>
  <div class="row"><span class="label">Chủ TK:</span><span class="value">NONG MANH THANH</span></div>
  <div class="row"><span class="label">Số tiền:</span><span class="value amount">${formattedAmount}đ</span></div>
  <div class="row"><span class="label">Nội dung CK:</span><span class="value">${description}</span></div>
  <p class="note">Mã đơn hàng: ${orderId}</p>
</div>
</body>
</html>`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            showToast("Vui lòng kiểm tra lại thông tin giao hàng", "error");
            return;
        }

        const orderAmount = getSelectedPrice();
        const qrDescription = `donhang${Math.floor(10000 + Math.random() * 90000)}`;
        const qrUrl = `https://qr.sepay.vn/img?bank=MBBank&acc=078911111&template=&amount=${Math.round(orderAmount)}&des=${encodeURIComponent(qrDescription)}`;

        let paymentWindow: Window | null = null;
        if (formData.paymentMethod === "bank_transfer" && typeof window !== "undefined") {
            paymentWindow = window.open("", "_blank", "width=520,height=700");
            if (paymentWindow) {
                paymentWindow.document.write("<p style='font-family:system-ui,sans-serif;padding:32px;text-align:center;'>Đang tạo thông tin chuyển khoản...</p>");
            }
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: selectedItems,
                    totalAmount: orderAmount,
                    guestInfo: formData,
                    paymentMethod: formData.paymentMethod,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                clearCart();
                
                // Save delivery info for future orders
                if (session?.user) {
                    // Save to user profile if logged in
                    try {
                        await fetch("/api/profile", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                phone: formData.phone,
                                address: formData.address,
                            }),
                        });
                    } catch (err) {
                        console.error("Failed to save profile:", err);
                    }
                } else {
                    // Save to localStorage if guest
                    localStorage.setItem("guestPhone", formData.phone);
                    localStorage.setItem("guestAddress", formData.address);
                }
                
                setSuccessData({
                    orderId: data.orderId,
                    paymentMethod: formData.paymentMethod,
                    amount: orderAmount,
                    qrUrl,
                    qrDescription,
                });
                if (paymentWindow && !paymentWindow.closed) {
                    const html = buildBankTransferPopupHtml(qrUrl, orderAmount, qrDescription, data.orderId);
                    paymentWindow.document.open();
                    paymentWindow.document.write(html);
                    paymentWindow.document.close();
                    paymentWindow.focus();
                }
                showToast("Đặt hàng thành công! Skyfood sẽ liên hệ bạn sớm nhé.", "success");
            } else {
                if (paymentWindow && !paymentWindow.closed) paymentWindow.close();
                showToast("Có lỗi khi tạo đơn hàng. Vui lòng thử lại.", "error");
            }
        } catch {
            showToast("Lỗi hệ thống. Vui lòng thử lại sau.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyOrderId = () => {
        if (successData?.orderId) {
            navigator.clipboard.writeText(successData.orderId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (successData) {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center text-center px-4 pt-24">
                <div className="w-24 h-24 bg-green-100 rounded-full flex justify-center items-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
                <p className="text-gray-500 mb-4 max-w-md">
                    Cảm ơn bạn đã tin tưởng Skyfood. Đơn hàng đang được xử lý.
                </p>

                {/* Order ID */}
                <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-4 mb-4 flex flex-col items-center gap-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Mã đơn hàng</p>
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-900 text-sm">{successData.orderId}</span>
                        <button onClick={copyOrderId}
                            className="p-1.5 rounded-lg bg-red-200 hover:bg-red-300 transition-colors">
                            {copied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-red-800" />}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">Lưu mã này để tra cứu đơn hàng</p>
                </div>

                {/* Bank Transfer Info */}
                {successData.paymentMethod === "bank_transfer" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-left max-w-sm w-full">
                        <p className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                            <MdOutlinePayment className="w-5 h-5" />
                            Thông tin chuyển khoản
                        </p>
                        {successData.qrUrl && (
                            <div className="mb-4 flex justify-center">
                                <img
                                    src={successData.qrUrl}
                                    alt="QR code chuyển khoản"
                                    className="w-48 h-48 object-contain rounded-2xl border border-gray-200"
                                />
                            </div>
                        )}
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between"><span className="text-gray-500">Ngân hàng:</span><strong>MB Bank</strong></div>
                            <div className="flex justify-between"><span className="text-gray-500">Số tài khoản:</span><strong>078911111</strong></div>
                            <div className="flex justify-between"><span className="text-gray-500">Chủ TK:</span><strong>SNACK HUB VN</strong></div>
                            <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span>
                                <strong className="text-red-700">{successData.amount ? `${successData.amount.toLocaleString("vi-VN")}đ` : ""}</strong>
                            </div>
                            <div className="flex justify-between"><span className="text-gray-500">Nội dung CK:</span>
                                <strong className="font-mono text-xs">{successData.qrDescription || ""}</strong>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 flex-wrap justify-center">
                    <Link href="/orders"
                        className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                        <ClipboardList className="w-4 h-4" />
                        Xem đơn hàng
                    </Link>
                    <Link href="/"
                        className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                        Tiếp tục mua hàng
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col justify-center items-center text-center pt-24">
                <Package className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold mb-2 text-gray-700">Giỏ hàng đang trống</h2>
                <p className="text-gray-500 text-sm mb-6">Thêm sản phẩm vào giỏ rồi quay lại nhé!</p>
                <button onClick={() => router.push("/")}
                    className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
                    Khám phá sản phẩm
                </button>
            </div>
        );
    }

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="container mx-auto px-4 max-w-6xl pt-32 pb-16">
                <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 font-medium mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
                </Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Thanh toán</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Form */}
                    <div className="flex-1">
                        <form id="checkout-form" onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Thông tin giao hàng</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleInputChange}
                                            placeholder="Nguyễn Văn An"
                                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                                        />
                                    </div>
                                    {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                            placeholder="0912345678"
                                            className={`w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                                        />
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email (để nhận thông báo)</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        placeholder="email@example.com"
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500 ${errors.email ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ giao hàng chi tiết *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                    <textarea
                                        name="address" value={formData.address} onChange={handleInputChange}
                                        rows={2} placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
                                        className={`w-full pl-9 pr-4 py-2.5 rounded-xl border outline-none transition-all focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                                    />
                                </div>
                                {errors.address && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.address}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tuỳ chọn)</label>
                                <textarea
                                    name="notes" value={formData.notes} onChange={handleInputChange}
                                    rows={2} placeholder="Ghi chú về thời gian giao, cách liên lạc..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 border-b pb-4 pt-2">Phương thức thanh toán</h3>
                            <div className="space-y-3">
                                <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === "cod" ? "border-red-400 bg-red-50" : "border-gray-200 hover:bg-gray-50"}`}>
                                    <input type="radio" name="paymentMethod" value="cod"
                                        checked={formData.paymentMethod === "cod"} onChange={handleInputChange}
                                        className="w-5 h-5 text-red-500 focus:ring-red-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                                            <BsCashStack className="w-5 h-5 text-red-500" />
                                            Thanh toán khi nhận hàng (COD)
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">Trả tiền mặt khi shipper giao hàng đến tay bạn</p>
                                    </div>
                                </label>
                                <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.paymentMethod === "bank_transfer" ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}>
                                    <input type="radio" name="paymentMethod" value="bank_transfer"
                                        checked={formData.paymentMethod === "bank_transfer"} onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-500 focus:ring-blue-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-900 flex items-center gap-2">
                                            <MdOutlinePayment className="w-5 h-5 text-blue-500" />
                                            Chuyển khoản ngân hàng
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">Chuyển khoản theo thông tin sau đây</p>
                                        {formData.paymentMethod === "bank_transfer" && (
                                            <div className="mt-3 bg-white rounded-xl border border-blue-200 p-3 space-y-1.5 text-sm">
                                                
                                                <div className="flex justify-between"><span className="text-gray-500">Số tiền:</span><strong className="text-red-700">{getTotalPrice().toLocaleString("vi-VN")}đ</strong></div>
                                                <p className="text-xs text-gray-400 pt-1">  (hiển thị sau khi xác nhận đặt hàng)</p>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="w-full lg:w-[420px] shrink-0">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 sticky top-28">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Đơn hàng của bạn</h3>

                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                                {selectedItems.map(item => (
                                    <div key={item._id} className="flex gap-3 items-center">
                                        <div className="w-16 h-16 relative bg-white rounded-xl border border-gray-200 overflow-hidden shrink-0">
                                            <Image src={item.image || "/images/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 text-sm">
                                            <p className="font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                                            <p className="text-gray-400 text-xs mt-0.5">x{item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-red-700 shrink-0 text-sm">
                                            {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Tạm tính</span>
                                    <span>{getSelectedPrice().toLocaleString("vi-VN")}đ</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Phí vận chuyển</span>
                                    <span className="text-green-600 font-medium">Miễn phí</span>
                                </div>
                                <div className="flex justify-between items-end border-t border-gray-200 pt-3 mt-2">
                                    <span className="font-bold text-gray-900">Tổng thanh toán</span>
                                    <span className="text-2xl font-bold text-red-500">{getSelectedPrice().toLocaleString("vi-VN")}đ</span>
                                </div>
                            </div>

                            <button type="submit" form="checkout-form" disabled={isSubmitting}
                                className="w-full mt-6 bg-red-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-500/30 hover:bg-red-700 hover:shadow-red-500/50 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:-translate-y-0">
                                {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

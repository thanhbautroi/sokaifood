"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setSent(true);
                setForm({ name: "", email: "", phone: "", message: "" });
            } else {
                const data = await res.json();
                setError(data.message || "Gửi thất bại, vui lòng thử lại");
            }
        } catch {
            setError("Lỗi hệ thống, vui lòng thử lại sau");
        } finally {
            setLoading(false);
        }
    };

    const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                        <MessageCircle className="w-4 h-4" />
                        Liên hệ
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-3">Chúng tôi luôn lắng nghe <span className="text-red-600">bạn</span></h1>
                    <p className="text-gray-500 max-w-xl mx-auto">Có câu hỏi về đơn hàng, sản phẩm hay muốn hợp tác? Hãy nhắn cho chúng mình nhé!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-blue-100 overflow-hidden mb-6">
                            <Image src="/logo.png" alt="SkyFood Logo" fill className="object-contain" />
                        </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                SkyFood — thiên đường đồ ăn vặt lớn nhất. Chúng tôi cam kết an toàn vệ sinh thực phẩm và giao hàng siêu tốc.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: Phone, label: "Hotline", value: "0909 123 456", href: "tel:0909123456" },
                                    { icon: Mail, label: "Email", value: "support@skyfood.vn", href: "mailto:support@skyfood.vn" },
                                    { icon: MapPin, label: "Địa chỉ", value: "Hà Nội, Việt Nam", href: null },
                                ].map(({ icon: Icon, label, value, href }) => (
                                    <div key={label} className="flex items-start gap-3">
                                        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Icon className="w-4 h-4 text-red-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                            {href ? (
                                                <a href={href} className="text-sm font-semibold text-gray-900 hover:text-red-600 transition-colors">{value}</a>
                                            ) : (
                                                <p className="text-sm font-semibold text-gray-900">{value}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-red-600 rounded-2xl p-6 text-white">
                            <h3 className="font-bold text-lg mb-2">Theo dõi đơn hàng</h3>
                            <p className="text-red-100 text-sm mb-4">Đăng nhập để xem trạng thái đơn hàng của bạn ngay lập tức.</p>
                            <a href="/orders" className="inline-block bg-white text-red-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors">
                                Xem đơn hàng →
                            </a>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                            {sent ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Gửi thành công! 🎉</h3>
                                    <p className="text-gray-500 text-sm mb-6">Chúng mình đã nhận được tin nhắn và sẽ phản hồi trong 24 giờ.</p>
                                    <button onClick={() => setSent(false)}
                                        className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors text-sm">
                                        Gửi tin nhắn khác
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h2>
                                    {error && (
                                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
                                    )}
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text" required value={form.name} onChange={f("name")}
                                                    placeholder="Tên của bạn"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                                                <input
                                                    type="tel" value={form.phone} onChange={f("phone")}
                                                    placeholder="0909 xxx xxx"
                                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email <span className="text-red-500">*</span></label>
                                            <input
                                                type="email" required value={form.email} onChange={f("email")}
                                                placeholder="email@example.com"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nội dung <span className="text-red-500">*</span></label>
                                            <textarea
                                                required rows={5} value={form.message} onChange={f("message")}
                                                placeholder="Bạn muốn hỏi về sản phẩm, đơn hàng hay cần hỗ trợ gì?"
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit" disabled={loading}
                                            className="w-full flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-60 shadow-lg shadow-red-500/20"
                                        >
                                            <Send className="w-4 h-4" />
                                            {loading ? "Đang gửi..." : "Gửi tin nhắn"}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

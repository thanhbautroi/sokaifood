"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { User, Phone, MapPin, Lock, CheckCircle2, AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [profileForm, setProfileForm] = useState({
        name: "",
        phone: "",
        address: "",
    });
    const [pwForm, setPwForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPw, setIsSavingPw] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
        if (status === "authenticated") {
            fetch("/api/profile")
                .then((r) => r.json())
                .then((data) => {
                    setProfileForm({
                        name: data.user?.name || "",
                        phone: data.user?.phone || "",
                        address: data.user?.address || "",
                    });
                    setIsLoading(false);
                });
        }
    }, [status, router]);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMsg(null);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profileForm),
            });
            if (res.ok) {
                setProfileMsg({ type: "success", text: "Cập nhật thông tin thành công!" });
            } else {
                const d = await res.json();
                setProfileMsg({ type: "error", text: d.message || "Có lỗi xảy ra." });
            }
        } catch {
            setProfileMsg({ type: "error", text: "Lỗi hệ thống." });
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSavePw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            setPwMsg({ type: "error", text: "Mật khẩu mới không khớp!" });
            return;
        }
        if (pwForm.newPassword.length < 6) {
            setPwMsg({ type: "error", text: "Mật khẩu mới phải có ít nhất 6 ký tự." });
            return;
        }
        setIsSavingPw(true);
        setPwMsg(null);
        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: pwForm.currentPassword,
                    newPassword: pwForm.newPassword,
                }),
            });
            if (res.ok) {
                setPwMsg({ type: "success", text: "Đổi mật khẩu thành công!" });
                setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                const d = await res.json();
                setPwMsg({ type: "error", text: d.message || "Có lỗi xảy ra." });
            }
        } catch {
            setPwMsg({ type: "error", text: "Lỗi hệ thống." });
        } finally {
            setIsSavingPw(false);
        }
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-16">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/" className="text-gray-400 hover:text-red-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h1>
                        <p className="text-sm text-gray-500">{session?.user?.email}</p>
                    </div>
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link href="/orders" className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-red-200 hover:shadow-md transition-all group">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:bg-red-200 transition-colors">
                            <ShoppingBag className="w-5 h-5 text-red-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">Đơn hàng của tôi</p>
                            <p className="text-xs text-gray-400">Xem lịch sử mua hàng</p>
                        </div>
                    </Link>
                    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-red-700" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 text-sm">{session?.user?.name}</p>
                            <p className="text-xs text-gray-400">Thành viên Skyfood</p>
                        </div>
                    </div>
                </div>

                {/* Profile Info Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-red-500" />
                        Thông tin cá nhân
                    </h2>
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    required
                                    value={profileForm.name}
                                    onChange={(e) => setProfileForm(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Tên của bạn"
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="tel"
                                    value={profileForm.phone}
                                    onChange={(e) => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                                    placeholder="Số điện thoại liên lạc"
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ mặc định</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    value={profileForm.address}
                                    onChange={(e) => setProfileForm(p => ({ ...p, address: e.target.value }))}
                                    placeholder="Địa chỉ giao hàng mặc định"
                                    rows={2}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm resize-none"
                                />
                            </div>
                        </div>

                        {profileMsg && (
                            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${profileMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                {profileMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {profileMsg.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-60"
                        >
                            {isSavingProfile ? "Đang lưu..." : "Lưu thông tin"}
                        </button>
                    </form>
                </div>

                {/* Change Password Form */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-500" />
                        Đổi mật khẩu
                    </h2>
                    <form onSubmit={handleSavePw} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={pwForm.currentPassword}
                                    onChange={(e) => setPwForm(p => ({ ...p, currentPassword: e.target.value }))}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={pwForm.newPassword}
                                    onChange={(e) => setPwForm(p => ({ ...p, newPassword: e.target.value }))}
                                    placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu mới</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    value={pwForm.confirmPassword}
                                    onChange={(e) => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        {pwMsg && (
                            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${pwMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                                {pwMsg.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                {pwMsg.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSavingPw}
                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-60"
                        >
                            {isSavingPw ? "Đang đổi..." : "Đổi mật khẩu"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { Mail, Trash2, Eye, EyeOff, Phone, Search, MessageCircle } from "lucide-react";

interface ContactMsg {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<ContactMsg[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<ContactMsg | null>(null);
    const [search, setSearch] = useState("");
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    useEffect(() => { fetchContacts(); }, []);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchContacts = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/contacts");
        const data = await res.json();
        setContacts(data.contacts || []);
        setLoading(false);
    };

    const markRead = async (id: string) => {
        await fetch("/api/admin/contacts", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
        setContacts(prev => prev.map(c => c._id === id ? { ...c, read: true } : c));
    };

    const handleDelete = async (id: string) => {
        setDeleting(id);
        const res = await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
        if (res.ok) {
            showToast("Đã xoá tin nhắn", "success");
            setContacts(prev => prev.filter(c => c._id !== id));
            if (selected?._id === id) setSelected(null);
        } else {
            showToast("Xoá thất bại", "error");
        }
        setDeleting(null);
    };

    const openMsg = (c: ContactMsg) => {
        setSelected(c);
        if (!c.read) markRead(c._id);
    };

    const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

    const unread = contacts.filter(c => !c.read).length;

    return (
        <div>
            {toast && (
                <div className={`fixed top-16 right-4 z-[9999] px-5 py-4 rounded-2xl shadow-2xl text-sm font-medium text-white
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>{toast.msg}</div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Liên hệ
                        {unread > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unread} mới</span>
                        )}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">{contacts.length} tin nhắn</p>
                </div>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm theo tên hoặc email..."
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white" />
            </div>

            <div className="flex gap-4 h-[600px]">
                {/* List */}
                <div className="w-72 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                    {loading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <MessageCircle className="w-8 h-8 animate-pulse" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6">
                            <Mail className="w-10 h-10 mb-3 opacity-40" />
                            <p className="text-sm">Chưa có tin nhắn nào</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto flex-1">
                            {filtered.map(c => (
                                <button key={c._id} onClick={() => openMsg(c)}
                                    className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-red-50 transition-colors flex items-start gap-3
                    ${selected?._id === c._id ? "bg-red-50 border-l-2 border-l-red-500" : ""}
                    ${!c.read ? "bg-blue-50/60" : ""}`}>
                                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-red-700 font-bold text-sm uppercase">{c.name[0]}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className={`text-sm truncate ${!c.read ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}>{c.name}</p>
                                            {!c.read && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                                        </div>
                                        <p className="text-xs text-gray-400 truncate">{c.message}</p>
                                        <p className="text-xs text-gray-300 mt-0.5">{new Date(c.createdAt).toLocaleDateString("vi-VN")}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    {!selected ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Mail className="w-12 h-12 mb-4 opacity-30" />
                            <p>Chọn tin nhắn để xem chi tiết</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <span className="text-red-700 font-bold uppercase">{selected.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{selected.name}</p>
                                        <p className="text-xs text-gray-400">{new Date(selected.createdAt).toLocaleString("vi-VN")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${selected.read ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-600"}`}>
                                        {selected.read ? <><EyeOff className="w-3 h-3 inline mr-1" />Đã đọc</> : <><Eye className="w-3 h-3 inline mr-1" />Chưa đọc</>}
                                    </span>
                                    <button onClick={() => handleDelete(selected._id)} disabled={deleting === selected._id}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="px-6 py-4 space-y-3 flex-1 overflow-y-auto">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <a href={`mailto:${selected.email}`} className="hover:text-red-500">{selected.email}</a>
                                </div>
                                {selected.phone && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <a href={`tel:${selected.phone}`} className="hover:text-red-500">{selected.phone}</a>
                                    </div>
                                )}
                                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Nội dung:</p>
                                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                                </div>
                                <a href={`mailto:${selected.email}?subject=Phản hồi từ Skyfood`}
                                    className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-700 transition-colors">
                                    <Mail className="w-4 h-4" />
                                    Trả lời qua email
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

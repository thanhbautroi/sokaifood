"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingCart, Users, PackageSearch, ExternalLink, LogOut, MessageCircle, Bell } from "lucide-react";

function NotificationBell() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setCount((data.pendingOrders ?? 0) + (data.unreadContacts ?? 0));
      }
    } catch { }
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/admin/orders" className="relative text-slate-400 hover:text-red-400 transition-colors">
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}

const navItems = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Đơn hàng", icon: ShoppingCart },
  { href: "/admin/products", label: "Sản phẩm", icon: PackageSearch },
  { href: "/admin/users", label: "Khách hàng", icon: Users },
  { href: "/admin/contacts", label: "Liên hệ", icon: MessageCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">Đang tải...</div>;
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white">
        <h1 className="text-2xl font-bold mb-4">Truy cập bị từ chối</h1>
        <p className="mb-4 text-slate-400">Bạn không có quyền truy cập trang quản trị.</p>
        <Link href="/" className="text-red-400 font-medium hover:underline">Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col" style={{ paddingTop: 0 }}>
      {/* Admin top bar */}
      <header className="fixed top-0 left-0 right-0 z-999 h-14 bg-slate-950 border-b border-slate-800 flex items-center px-3 sm:px-6 gap-2 sm:gap-3">
        <span className="text-red-400 font-black text-lg tracking-tight">V-LIGHT</span>
        <span className="text-slate-500 text-xs bg-slate-800 px-2 py-0.5 rounded-full">Admin</span>
        <div className="ml-auto flex items-center gap-3">
          <NotificationBell />
          <span className="text-slate-400 text-sm hidden sm:block">{session?.user?.name}</span>
          <Link href="/" aria-label="Về trang chủ" className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs transition-colors whitespace-nowrap">
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Về trang chủ</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col pt-14 md:flex-row">
        {/* Sidebar */}
        <aside className="w-full bg-slate-900 text-slate-300 shadow-xl md:sticky md:top-14 md:min-h-[calc(100vh-56px)] md:w-64 md:shrink-0 md:self-start">
          <div className="px-4 pt-3 pb-2 md:p-6 md:pb-4">
            <h2 className="text-sm font-bold text-white tracking-tight md:text-base">Quản trị viên</h2>
            <p className="hidden text-xs text-slate-500 uppercase font-semibold tracking-wider mt-0.5 md:block">Bảng điều khiển</p>
          </div>
          <nav className="grid grid-cols-3 gap-2 px-3 pb-3 md:block md:space-y-1 md:px-4 md:pb-0">
            {navItems.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex min-w-0 items-center whitespace-nowrap px-2 py-2 rounded-xl transition-all group text-[11px] font-medium md:px-4 md:py-2.5 md:text-sm
                    ${active ? "bg-red-500 text-white" : "hover:bg-slate-800 hover:text-white"}`}
                >
                  <Icon className={`w-4 h-4 mr-1.5 md:mr-3 transition-colors ${active ? "text-white" : "text-slate-400 group-hover:text-red-500"}`} />
                  {label}
                </Link>
              );
            })}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full min-w-0 items-center whitespace-nowrap px-2 py-2 rounded-xl text-[11px] font-medium text-slate-400 hover:bg-red-900/30 hover:text-red-400 transition-all group md:px-4 md:py-2.5 md:text-sm"
            >
              <LogOut className="w-4 h-4 mr-1.5 md:mr-3 group-hover:text-red-400 transition-colors" />
              Đăng xuất
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 w-full flex-1 overflow-x-hidden p-4 sm:p-6 md:p-10">
          <div className="mx-auto w-full min-w-0 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

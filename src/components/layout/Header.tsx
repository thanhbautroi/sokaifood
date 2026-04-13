"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/useCartStore";

const navLinks = [
  { name: "Trang chủ", href: "/" },
  { name: "Đồ cay", href: "/collection/do-cay" },
  { name: "Trái cây sấy", href: "/collection/trai-cay-say" },
  { name: "Các loại hạt", href: "/collection/cac-loai-hat" },
  { name: "Đồ uống", href: "/collection/do-uong" },
  { name: "Đơn hàng", href: "/orders" },
  { name: "Liên hệ", href: "/contact" },
];

export default function Header() {
  const { data: session, status } = useSession();
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Avoid hydration mismatch by waiting for mount
    setCartItemsCount(getTotalItems());
  }, [getTotalItems()]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-3">
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1] md:hidden"
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className={cn(
          "relative flex items-center justify-between px-6 h-20 rounded-full transition-all duration-500",
          isScrolled
            ? "border border-amber-200 bg-white/90 backdrop-blur-md shadow-lg"
            : "border border-transparent bg-white/70 backdrop-blur-sm"
        )}>

          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer group z-10">
            <div className="relative w-11 h-11 flex-shrink-0 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center rounded-full bg-blue-100 overflow-hidden">
              <Image
                src="/logo.png"
                alt="SkyFood Logo"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <span className="ml-2 font-black text-2xl text-red-600 tracking-tight">Sky<span className="text-gray-700">Food</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 z-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-bold text-gray-700 transition-all hover:text-red-500 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[3px] rounded-full bg-red-500 transition-all group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* User & Cart CTA */}
          <div className="hidden md:flex items-center gap-4 z-10">
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700 transition-all"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {status === "loading" ? (
              <div className="w-24 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative group/auth">
                <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full font-bold hover:bg-red-100 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-red-800 font-bold text-xs uppercase">
                    {session.user?.name?.[0] || "U"}
                  </div>
                  <span className="text-sm max-w[100px] truncate">{session.user?.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/auth:opacity-100 group-hover/auth:visible transition-all origin-top-right z-50">
                  <div className="p-2 space-y-1">
                    {(session.user as any)?.role === "admin" && (
                      <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium">
                        Quản trị hệ thống
                      </Link>
                    )}
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium">
                      Hồ sơ của tôi
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium">
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 bg-red-500 text-white rounded-full font-bold transition-all hover:bg-red-700 hover:shadow-lg hover:scale-105 text-sm"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-red-500 transition-colors z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden mt-2 overflow-hidden rounded-2xl border border-amber-200 bg-white/95 backdrop-blur-xl shadow-xl"
            >
              <div className="p-6 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className="block text-base font-bold text-gray-700 transition-all hover:text-red-500 hover:pl-2 py-3 border-b border-gray-100 last:border-0"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-4 grid grid-cols-2 gap-3"
                >
                  <Link
                    href="/cart"
                    className="flex flex-col items-center justify-center gap-1 py-3 bg-gray-100 text-gray-800 rounded-xl font-bold hover:bg-gray-200 transition-all relative"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      <ShoppingBag className="w-5 h-5" />
                      {cartItemsCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                          {cartItemsCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs">Giỏ hàng</span>
                  </Link>
                  {session ? (
                    <button
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center gap-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
                    >
                      <X className="w-5 h-5" />
                      <span className="text-xs">Đăng xuất</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex flex-col items-center justify-center gap-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="text-xs">Đăng nhập</span>
                    </Link>
                  )}
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

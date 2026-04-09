"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Logo & About */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center cursor-pointer group mb-6">
              <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-100 overflow-hidden">
                <Image src="/logo.png" alt="SkyFood Logo" fill className="object-contain" />
              </div>
              <div className="ml-3">
                <span className="block font-bold text-2xl text-white tracking-tight leading-none">Sky<span className="text-red-400">Food</span></span>
                <span className="text-red-400 text-sm font-medium">Bản giao hưởng hương vị</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Skyfood - Thiên đường đồ ăn vặt lớn nhất dành cho bạn! Cam kết an toàn vệ sinh thực phẩm, giao hàng siêu tốc, ngập tràn ưu đãi.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Danh mục</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/collection/do-cay" className="hover:text-red-400 transition-colors">
                  Đồ Cay Nội Địa
                </Link>
              </li>
              <li>
                <Link href="/collection/trai-cay-say" className="hover:text-red-400 transition-colors">
                  Trái Cây Sấy Dẻo
                </Link>
              </li>
              <li>
                <Link href="/collection/cac-loai-hat" className="hover:text-red-400 transition-colors">
                  Các Loại Hạt Dinh Dưỡng
                </Link>
              </li>
              <li>
                <Link href="/collection/do-uong" className="hover:text-red-400 transition-colors">
                  Nước Giải Khát
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Chính sách</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="hover:text-red-400 transition-colors">
                  Chính sách thành viên
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-400 transition-colors">
                  Chính sách đổi trả bảo hành
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-red-400 transition-colors">
                  Theo dõi đơn hàng
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-red-400 transition-colors">
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-red-400 transition-colors">
                  Câu hỏi thường gặp (FAQ)
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>© {new Date().getFullYear()} SkyFood. Nền tảng phân phối đồ ăn vặt hàng đầu.</p>
            <p className="text-gray-500">
              đồ án thực hiện bới nhóm 5, lớp UDPM23-02
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

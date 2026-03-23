"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center overflow-hidden bg-white pt-32 pb-20">
      {/* Background với ảnh đồ ăn vặt */}
      <div className="absolute right-0 top-0 w-[55%] h-full">
        <div className="relative w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=2671&ixlib=rb-4.0.3"
            alt="Đồ Ăn Vặt Skyfood"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-white" />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-32 left-[15%] w-2 h-2 bg-accent rounded-full" />
      <div className="absolute top-48 left-[18%] w-1 h-1 bg-accent/60 rounded-full" />
      <div className="absolute bottom-40 left-[12%] w-3 h-3 border-2 border-accent/40 rounded-full" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block mb-8"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-red-500 font-bold bg-red-100 px-3 py-1.5 rounded-full">
              Khám Phá Hương Vị
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
            style={{ lineHeight: 1.1 }}
          >
            Thế giới
            <br />
            <span className="text-red-500 italic">đồ ăn vặt</span> siêu
            <br />
            cuốn hút
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 mb-10 max-w-md"
            style={{ lineHeight: 1.7 }}
          >
            Đánh thức vị giác của bạn với hàng ngàn món ăn vặt mlem mlem, chuẩn vị, ship siêu tốc.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/collection/do-cay"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-red-500 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/30 hover:-translate-y-1 transition-all"
            >
              Đặt hàng ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/collection/trai-cay-say"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-red-500 text-red-700 font-bold rounded-xl hover:bg-red-50 hover:shadow-lg transition-all"
            >
              Xem danh mục
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 flex gap-8 md:gap-12"
          >
            <div>
              <div className="text-4xl font-black text-gray-900 mb-1">500+</div>
              <div className="text-sm text-gray-500 font-medium">Món ăn vặt</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-1">10k+</div>
              <div className="text-sm text-gray-500 font-medium">Khách hàng</div>
            </div>
            <div>
              <div className="text-4xl font-black text-red-500 mb-1">4.9</div>
              <div className="text-sm text-gray-500 font-medium">Đánh giá</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

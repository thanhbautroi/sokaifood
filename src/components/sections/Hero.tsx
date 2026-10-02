"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative min-h-[72vh] md:min-h-[78vh] flex items-center overflow-hidden bg-white pt-24 pb-12 md:pt-28 md:pb-16">
      {/* Product imagery */}
      <div className="absolute right-0 top-0 w-[55%] h-full">
        <div className="relative w-full h-full">
          <Image
            src="/images/banner.jpg"
            alt="Hoa trang trí cho không gian sống"
            fill
            className="object-cover object-[80%_center] md:object-[65%_center]"
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
              Ánh sáng từ nhung
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight"
            style={{ lineHeight: 1.1 }}
          >
            Điểm tô
            <br />
            <span className="text-red-500 italic">không gian</span> theo
            <br />
            cách riêng
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-gray-600 mb-10 max-w-md"
            style={{ lineHeight: 1.7 }}
          >
            Khám phá đèn học tiện dụng, hoa trang trí và những món decor giúp góc nhỏ thêm cảm hứng.
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
              Khám phá sản phẩm
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/collection/cac-loai-hat"
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
              <div className="text-4xl font-black text-gray-900 mb-1">04</div>
              <div className="text-sm text-gray-500 font-medium">Danh mục sản phẩm</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 mb-1">Xinh</div>
              <div className="text-sm text-gray-500 font-medium">Cho mọi góc nhà</div>
            </div>
            <div>
              <div className="text-4xl font-black text-red-500 mb-1">Chọn</div>
              <div className="text-sm text-gray-500 font-medium">Theo gu của bạn</div>
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

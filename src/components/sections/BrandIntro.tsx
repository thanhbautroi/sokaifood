"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandIntro() {
  return (
    <section className="py-12 md:py-32 bg-white relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute left-0 top-1/2 w-32 h-px bg-accent/20" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-[90%] mx-auto aspect-square lg:w-auto lg:ml-12 lg:aspect-3/4 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/anhtb.jpg"
                alt="Hoa trang trí cho không gian sống"
                fill
                className="object-cover"
              />
              {/* Decorative frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-red-200 rounded-2xl -z-10" />
            </div>
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-4 md:space-y-6"
          >
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-red-500 font-bold bg-red-100 px-3 py-1.5 rounded-full">
                Về V-LIGHT
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Chọn món
              <br />
              điểm tô
              <br />
              <span className="text-red-500 italic">góc riêng</span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                V-LIGHT mang đến những món đồ hữu ích và giàu cảm hứng cho góc học tập, bàn làm việc và ngôi nhà của bạn.
                Từ đèn học, hoa trang trí đến các món decor, mỗi lựa chọn đều giúp không gian thêm dấu ấn riêng.
              </p>
              <p>
                Chúng tôi ưu tiên sản phẩm có thông tin rõ ràng, thiết kế đẹp và tiện dụng để bạn dễ dàng chọn món phù hợp.
                Cần thêm gợi ý? Đội ngũ V-LIGHT luôn sẵn sàng hỗ trợ bạn.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 pt-5 md:pt-8 border-t border-gray-100 mt-5 md:mt-8">
              <div>
                <div className="text-3xl font-black text-gray-900 mb-1">Đẹp</div>
                <div className="text-sm text-gray-500 font-medium">Chọn theo gu</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 mb-1">Tiện</div>
                <div className="text-sm text-gray-500 font-medium">Dễ dàng đặt mua</div>
              </div>
              <div>
                <div className="text-3xl font-black text-red-500 mb-1">Gu</div>
                <div className="text-sm text-gray-500 font-medium">Cho mọi không gian</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

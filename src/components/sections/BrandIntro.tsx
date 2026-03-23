"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandIntro() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute left-0 top-1/2 w-32 h-px bg-accent/20" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] lg:ml-12 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://minhnguyenfood.vn/uploads/source/tin-tuc/269686919-431435252017258-8051846614270916793-n.jpg"
                alt="Skyfood Tinh Hoa Đồ Ăn Vặt"
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
            className="space-y-6"
          >
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-red-500 font-bold bg-red-100 px-3 py-1.5 rounded-full">
                Về Skyfood
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Tuyển chọn
              <br />
              hương vị
              <br />
              <span className="text-red-500 italic">đỉnh cao</span>
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
              <p>
                Skyfood tự hào là điểm đến lý tưởng cho những tín đồ đam mê ẩm thực ăn vặt.
                Chúng tôi liên tục chọn lọc những món ăn vặt hot nhất, ngon nhất từ khắp mọi nơi.
              </p>
              <p>
                Với tiêu chí an toàn vệ sinh thực phẩm lên hàng đầu, mọi sản phẩm tại
                Skyfood đều có nguồn gốc rõ ràng, date mới, đảm bảo độ giòn ngon và trọn vị.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100 mt-8">
              <div>
                <div className="text-3xl font-black text-gray-900 mb-1">100%</div>
                <div className="text-sm text-gray-500 font-medium">Chính hãng</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-900 mb-1">Giao</div>
                <div className="text-sm text-gray-500 font-medium">Siêu tốc 2h</div>
              </div>
              <div>
                <div className="text-3xl font-black text-red-500 mb-1">Date</div>
                <div className="text-sm text-gray-500 font-medium">Luôn mới</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

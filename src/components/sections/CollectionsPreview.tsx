"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "do-cay",
    name: "Đèn học",
    description: "Ánh sáng tiện dụng, giúp góc học tập và làm việc thêm gọn gàng, dễ chịu.",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=85&w=900",
    href: "/collection/do-cay",
  },
  {
    id: "trai-cay-say",
    name: "Hoa",
    description: "Thêm sắc màu và nét mềm mại cho bàn làm việc, phòng khách hay món quà nhỏ.",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&q=85&w=900",
    href: "/collection/trai-cay-say",
  },
  {
    id: "cac-loai-hat",
    name: "Đồ trang trí",
    description: "Những điểm nhấn xinh xắn để căn phòng mang đậm dấu ấn của bạn.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=85&w=900",
    href: "/collection/cac-loai-hat",
  },
  {
    id: "do-uong",
    name: "Khác",
    description: "Khám phá thêm những món đồ tiện ích và quà tặng cho cuộc sống hằng ngày.",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=85&w=900",
    href: "/collection/do-uong",
  },
];

export default function CollectionsPreview() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-red-500 font-bold bg-red-100 px-3 py-1.5 rounded-full mb-4 inline-block">
              Danh mục
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight pt-2">
              Hoàn thiện không gian sống
            </h2>
            <p className="text-gray-600 text-lg">
              Từ góc học tập đến căn nhà thân yêu, tìm món đồ hợp nhu cầu và phong cách của bạn.
            </p>
          </motion.div>
        </div>

        {/* Collections - 4 items grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((collection, index) => (
            <motion.div
              key={collection.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={collection.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-200 mb-4 rounded-lg">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Text overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-serif font-bold mb-1">
                      {collection.name}
                    </h3>
                    <p className="text-xs text-white/80 mb-3 line-clamp-2">
                      {collection.description}
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-4 transition-all">
                      Khám phá
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

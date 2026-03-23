"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "do-cay",
    name: "Đồ Cay Nội Địa",
    description: "Cay nồng, đậm vị, kích thích mọi giác quan. Ăn là ghiền!",
    image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800",
    href: "/collection/do-cay",
  },
  {
    id: "trai-cay-say",
    name: "Trái Cây Sấy",
    description: "Giòn rụm, giữ nguyên vị ngọt tự nhiên, nhâm nhi cả ngày không chán",
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800",
    href: "/collection/trai-cay-say",
  },
  {
    id: "cac-loai-hat",
    name: "Hạt Dinh Dưỡng",
    description: "Bùi béo, thơm ngon, tốt cho sức khỏe. Phù hợp ăn kiêng, ăn vặt",
    image: "https://images.unsplash.com/photo-1596591606975-97ee5cef3a1e?w=800",
    href: "/collection/cac-loai-hat",
  },
  {
    id: "do-uong",
    name: "Giải Khát Đỉnh",
    description: "Nước ép, trà sữa, kombucha tươi mát xua tan cơn khát tức thì",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800",
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
              Ăn vặt cực đã tẹt ga
            </h2>
            <p className="text-gray-600 text-lg">
              Đa dạng các loại snack phù hợp cho mọi lứa tuổi và sở thích
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

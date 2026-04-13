"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import { Eye } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    collection: string;
    quantity?: number;
    inStock?: boolean;
  };
}

const COLLECTION_LABELS: Record<string, string> = {
  "do-cay": "Đồ Cay",
  "trai-cay-say": "Trái Cây Sấy",
  "cac-loai-hat": "Hạt Dinh Dưỡng",
  "do-uong": "Đồ Uống",
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col h-full">
      {/* Collection label - links to collection page */}
      <Link
        href={`/collection/${product.collection}`}
        className="text-xs text-red-500 uppercase tracking-wider font-bold mb-2 hover:text-red-800 transition-colors w-fit"
        onClick={(e) => e.stopPropagation()}
      >
        {COLLECTION_LABELS[product.collection] || product.collection}
      </Link>

      {/* Product card - links to product detail */}
      <Link href={`/product/${product.slug}`} className="flex-1">
        <motion.div
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
        >
          {/* Image container */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-50 flex-shrink-0">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Hover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
            >
              <div className="flex items-center gap-2 text-white text-sm font-medium">
                <Eye className="w-4 h-4" />
                Xem chi tiết
              </div>
            </motion.div>

            {/* Sale badge */}
            {(typeof product.quantity === "number" && product.quantity <= 0) ? (
              <div className="absolute top-3 left-3 bg-gray-800 text-white text-xs px-3 py-1 font-bold rounded-full">
                Hết hàng
              </div>
            ) : product.originalPrice ? (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-3 py-1 font-bold rounded-full">
                SALE
              </div>
            ) : null}
          </div>

          {/* Info */}
          <div className="flex flex-col flex-1 p-4">
            <h3 className="font-medium text-gray-900 group-hover:text-red-500 transition-colors line-clamp-2 mb-3">
              {product.name}
            </h3>
            <div className="mt-auto flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}


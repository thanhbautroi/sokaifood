import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function FeaturedProducts() {
  await dbConnect();
  const products = await Product.find({ featured: true }).limit(6).lean();

  const featuredProducts = products.map(p => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: p.images,
    model3D: p.model3D,
    collection: p.collectionType,
    featured: p.featured,
    inStock: p.inStock,
  }));

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <span className="text-xs tracking-[0.3em] uppercase text-red-500 font-bold bg-red-100 px-3 py-1.5 rounded-full mb-4 inline-block">
              Sản phẩm đỉnh chóp
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight pt-2">
              Bán chạy nhất tuần
            </h2>
          </div>
          <Link
            href="/collection/do-cay"
            className="inline-flex items-center gap-2 text-red-700 font-bold hover:text-red-800 transition-colors group"
          >
            Xem tất cả đồ cay
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products Grid - equal height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 items-start">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

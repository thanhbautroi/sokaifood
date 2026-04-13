import { Metadata } from "next";
import Link from "next/link";
import CollectionFilter from "@/components/product/CollectionFilter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ChevronRight } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const metadata: Metadata = {
  title: "Đồ Cay Nội Địa",
  description: "Khám phá bộ sưu tập đồ cay nội địa siêu cuốn, siêu dính tại Skyfood",
};

export default async function DoCayPage() {
  await dbConnect();
  const products = await Product.find({ collectionType: "do-cay" }).lean();

  const collectionProducts = products.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    price: p.price,
    originalPrice: p.originalPrice,
    images: p.images,
    collection: p.collectionType,
    inStock: p.inStock,
    quantity: p.quantity,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-red-500 transition-colors">Trang chủ</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-red-700 font-medium">Đồ Cay Nội Địa</span>
          </div>
        </div>
      </div>

      <section className="py-16 bg-gradient-to-br from-white via-red-50 to-red-100/50">
        <div className="container mx-auto px-6">
          <ScrollReveal>
            <div className="max-w-3xl">
              <p className="text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">Cay Xé Lưỡi</p>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Đồ Cay Nội Địa Trung</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Thiên đường của những tín đồ ăn cay. Chân gà, que cay, mỳ cay tẩm vị đậm đà, càng ăn càng cuốn.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6">
          <CollectionFilter products={collectionProducts} totalCount={collectionProducts.length} />
        </div>
      </section>
    </div>
  );
}

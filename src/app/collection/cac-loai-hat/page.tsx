import { Metadata } from "next";
import Link from "next/link";
import CollectionFilter from "@/components/product/CollectionFilter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ChevronRight } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const metadata: Metadata = {
    title: "Đồ trang trí",
    description: "Khám phá đồ trang trí giúp căn phòng thêm ấm cúng và thể hiện phong cách riêng.",
};

export default async function CacLoaiHatPage() {
    await dbConnect();
    const products = await Product.find({ collectionType: "cac-loai-hat" }).lean();

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
                        <span className="text-red-700 font-medium">Đồ trang trí</span>
                    </div>
                </div>
            </div>

            <section className="py-16 bg-gradient-to-br from-white via-amber-50 to-yellow-50">
                <div className="container mx-auto px-6">
                    <ScrollReveal>
                        <div className="max-w-3xl">
                            <p className="text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">Tạo dấu ấn riêng</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Đồ trang trí nhà cửa</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Những món decor được chọn để làm mới góc làm việc, phòng ngủ và các khoảng nhỏ trong ngôi nhà.
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

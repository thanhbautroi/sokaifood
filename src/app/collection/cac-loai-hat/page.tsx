import { Metadata } from "next";
import Link from "next/link";
import CollectionFilter from "@/components/product/CollectionFilter";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ChevronRight } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

export const metadata: Metadata = {
    title: "Hạt Dinh Dưỡng",
    description: "Các loại hạt dinh dưỡng cao cấp, tốt cho sức khỏe tại Skyfood",
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
    }));

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Link href="/" className="hover:text-red-500 transition-colors">Trang chủ</Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-red-700 font-medium">Hạt Dinh Dưỡng</span>
                    </div>
                </div>
            </div>

            <section className="py-16 bg-gradient-to-br from-white via-amber-50 to-yellow-50">
                <div className="container mx-auto px-6">
                    <ScrollReveal>
                        <div className="max-w-3xl">
                            <p className="text-red-500 text-sm font-bold tracking-[0.2em] uppercase mb-4">Bùi Béo Thơm Ngon</p>
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Hạt Dinh Dưỡng Cao Cấp</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Macca, điều, dẻ cười, hạt hướng dương — bùi béo thơm ngon, giàu dinh dưỡng cho cả ngày tràn đầy sức sống.
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

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Share2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { ScrollReveal, FadeIn } from "@/components/ui/ScrollReveal";
import ProductCard from "@/components/product/ProductCard";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/product/AddToCartButton";
import ReviewSection from "@/components/product/ReviewSection";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

const COLLECTION_LABELS: Record<string, string> = {
  "do-cay": "Đồ Cay Nội Địa",
  "trai-cay-say": "Trái Cây Sấy",
  "cac-loai-hat": "Hạt Dinh Dưỡng",
  "do-uong": "Đồ Uống Giải Khát",
};

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug }).lean();

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  await dbConnect();
  const productData = await Product.findOne({ slug: params.slug }).lean();

  if (!productData) {
    notFound();
  }

  const product = {
    _id: productData._id.toString(),
    id: productData._id.toString(),
    name: productData.name,
    slug: productData.slug,
    description: productData.description,
    price: productData.price,
    originalPrice: productData.originalPrice,
    images: productData.images,
    collection: productData.collectionType,
    featured: productData.featured,
    inStock: productData.inStock,
    quantity: productData.quantity ?? 0,
  };

  const collectionLabel = COLLECTION_LABELS[product.collection] || product.collection;

  // Get related products
  const relatedData = await Product.find({
    collectionType: productData.collectionType,
    slug: { $ne: params.slug },
  })
    .limit(4)
    .lean();

  const relatedProducts = relatedData.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    images: p.images,
    collection: p.collectionType,
    featured: p.featured,
    inStock: p.inStock,
    quantity: p.quantity,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-accent transition-colors">
              Trang chủ
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href={`/collection/${product.collection}`}
              className="hover:text-accent transition-colors"
            >
              {collectionLabel}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12">
            {/* Left: Images & 3D */}
            <div className="space-y-6">
              <ScrollReveal width="100%">
                <ProductGallery images={product.images} name={product.name} />
              </ScrollReveal>
            </div>

            {/* Right: Info */}
            <div className="space-y-6">
              <ScrollReveal>
                <div>
                  <p className="text-accent text-sm font-medium tracking-[0.2em] uppercase mb-2">
                    {collectionLabel}
                  </p>
                  <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                    {product.name}
                  </h1>
                  {product.price > 0 && (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-accent">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xl text-gray-400 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  )}
                  {product.price === 0 && (
                    <p className="text-lg text-accent font-medium italic">
                      Liên hệ để biết giá
                    </p>
                  )}
                </div>
              </ScrollReveal>

              <FadeIn delay={0.1}>
                <div className="border-t border-b border-gray-200 py-6">
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${product.quantity > 0 ? "bg-green-500" : "bg-red-500"
                        }`}
                    />
                    <span className={`text-sm font-medium ${product.quantity > 0 ? "text-gray-600" : "text-red-600 font-bold"}`}>
                      {product.quantity > 0 ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="space-y-3">
                  <AddToCartButton product={product} />
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="bg-accent/5 rounded-2xl p-6 space-y-3">
                  <h3 className="font-semibold text-primary">Thông tin thêm</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      Đảm bảo An toàn Vệ sinh thực phẩm
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      Giao hàng hỏa tốc trong 2H
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      Đổi trả 1-1 nếu lỗi sản xuất
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                      Tư vấn miễn phí 24/7
                    </li>
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {/* Reviews Section */}
      <ReviewSection productId={product._id} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-8">
                Sản phẩm liên quan
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <FadeIn key={relatedProduct.id}>
                  <ProductCard product={relatedProduct} />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

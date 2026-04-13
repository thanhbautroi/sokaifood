"use client";

import { useState, useMemo, useTransition } from "react";
import { SlidersHorizontal, ArrowUpDown, Search, X, ChevronDown } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";

type Product = {
    id: string;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images: string[];
    collection: string;
    inStock: boolean;
    quantity?: number;
};

type SortOption = "default" | "price_asc" | "price_desc" | "name_asc";

const SORT_LABELS: Record<SortOption, string> = {
    default: "Mặc định",
    price_asc: "Giá: Thấp → Cao",
    price_desc: "Giá: Cao → Thấp",
    name_asc: "Tên A → Z",
};

const PRICE_RANGES = [
    { label: "Tất cả", min: 0, max: Infinity },
    { label: "Dưới 30.000đ", min: 0, max: 30000 },
    { label: "30.000 – 60.000đ", min: 30000, max: 60000 },
    { label: "60.000 – 100.000đ", min: 60000, max: 100000 },
    { label: "Trên 100.000đ", min: 100000, max: Infinity },
];

export default function CollectionFilter({ products, totalCount }: { products: Product[]; totalCount: number }) {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<SortOption>("default");
    const [priceRange, setPriceRange] = useState(0); // index into PRICE_RANGES
    const [showSale, setShowSale] = useState(false);
    const [showInStock, setShowInStock] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [, startTransition] = useTransition();

    const filtered = useMemo(() => {
        let result = [...products];

        // Search
        if (search.trim()) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
        }

        // Price range
        const range = PRICE_RANGES[priceRange];
        result = result.filter(p => p.price >= range.min && p.price <= range.max);

        // Sale only
        if (showSale) result = result.filter(p => p.originalPrice && p.originalPrice > p.price);

        // In stock only
        if (showInStock) result = result.filter(p => p.inStock);

        // Sort
        switch (sort) {
            case "price_asc": result.sort((a, b) => a.price - b.price); break;
            case "price_desc": result.sort((a, b) => b.price - a.price); break;
            case "name_asc": result.sort((a, b) => a.name.localeCompare(b.name, "vi")); break;
        }

        return result;
    }, [products, search, sort, priceRange, showSale, showInStock]);

    const activeFilterCount = [
        priceRange !== 0, showSale, showInStock
    ].filter(Boolean).length;

    const clearAllFilters = () => {
        setSearch("");
        setSort("default");
        setPriceRange(0);
        setShowSale(false);
        setShowInStock(false);
    };

    return (
        <div>
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <p className="text-gray-500 text-sm">
                    Hiển thị <span className="font-semibold text-gray-900">{filtered.length}</span>
                    {filtered.length !== totalCount && <span> / {totalCount}</span>} sản phẩm
                </p>

                <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => startTransition(() => setSearch(e.target.value))}
                            placeholder="Tìm sản phẩm..."
                            className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none w-[180px]"
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <div className="relative">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortOption)}
                            className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none bg-white appearance-none cursor-pointer"
                        >
                            {(Object.keys(SORT_LABELS) as SortOption[]).map(key => (
                                <option key={key} value={key}>{SORT_LABELS[key]}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-xl border transition-all ${showFilters ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-700 hover:border-red-300"}`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Bộ lọc
                        {activeFilterCount > 0 && (
                            <span className={`flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${showFilters ? "bg-white text-red-500" : "bg-red-500 text-white"}`}>
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
                    <div className="flex flex-wrap gap-6">
                        {/* Price Range */}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Khoảng giá</p>
                            <div className="flex flex-wrap gap-2">
                                {PRICE_RANGES.map((range, i) => (
                                    <button key={i} onClick={() => setPriceRange(i)}
                                        className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${priceRange === i ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600 hover:border-red-300"}`}>
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Toggle Filters */}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Hiển thị</p>
                            <div className="flex flex-wrap gap-2">
                                <button onClick={() => setShowSale(!showSale)}
                                    className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${showSale ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600 hover:border-red-300"}`}>
                                    Đang giảm giá
                                </button>
                                <button onClick={() => setShowInStock(!showInStock)}
                                    className={`px-3 py-1.5 text-xs rounded-full border font-medium transition-all ${showInStock ? "bg-red-500 text-white border-red-500" : "border-gray-200 text-gray-600 hover:border-red-300"}`}>
                                    Còn hàng
                                </button>
                            </div>
                        </div>

                        {/* Clear */}
                        {activeFilterCount > 0 && (
                            <div className="flex items-end">
                                <button onClick={clearAllFilters}
                                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                                    <X className="w-3.5 h-3.5" />
                                    Xoá bộ lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Products Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Không tìm thấy sản phẩm phù hợp</p>
                    <button onClick={clearAllFilters} className="mt-4 text-red-500 text-sm font-medium hover:underline">
                        Xoá bộ lọc
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                    {filtered.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}

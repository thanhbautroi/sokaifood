"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
    images: string[];
    name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

    const validImages = images.filter((img) => {
        try {
            const parsed = new URL(img);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    });

    if (validImages.length === 0) {
        return (
            <div className="w-full aspect-[3/4] rounded-2xl bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Chưa có ảnh</span>
            </div>
        );
    }

    const handlePrev = () => {
        setSelectedIndex((prev) =>
            prev === 0 ? validImages.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setSelectedIndex((prev) =>
            prev === validImages.length - 1 ? 0 : prev + 1
        );
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-white shadow-lg group">
                {imageErrors.has(selectedIndex) ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">Không tải được ảnh</span>
                    </div>
                ) : (
                    <Image
                        src={validImages[selectedIndex]}
                        alt={`${name} - Ảnh ${selectedIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500"
                        priority={selectedIndex === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={() =>
                            setImageErrors((prev) => new Set(prev).add(selectedIndex))
                        }
                    />
                )}

                {/* Navigation Arrows */}
                {validImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            aria-label="Ảnh trước"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                            aria-label="Ảnh tiếp"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                            {selectedIndex + 1} / {validImages.length}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-3">
                    {validImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 transition-all ${selectedIndex === index
                                    ? "ring-2 ring-accent ring-offset-2 shadow-md"
                                    : "opacity-60 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${name} - Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                                onError={() =>
                                    setImageErrors((prev) => new Set(prev).add(index))
                                }
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

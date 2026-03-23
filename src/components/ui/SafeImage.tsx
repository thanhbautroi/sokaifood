"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export default function SafeImage({ src, alt, fill, className, width, height }: SafeImageProps) {
  const [error, setError] = useState(false);

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  if (!src || !isValidUrl(src) || error) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className || ''}`}>
        <span className="text-gray-400 text-xs">No image</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      onError={() => setError(true)}
    />
  );
}

import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#C41230",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "SkyFood | Thiên đường đồ ăn vặt",
    template: "%s | SkyFood",
  },
  description:
    "SkyFood - Nền tảng phân phối đồ ăn vặt hàng đầu. Khám phá hàng ngàn món ăn vặt mlem mlem như đồ cay nội địa, trái cây sấy, các loại hạt dinh dưỡng và nước giải khát.",
  keywords: [
    "đồ ăn vặt",
    "đồ ăn vặt nội địa trung",
    "snack",
    "trái cây sấy",
    "các loại hạt",
    "nước ngọt",
    "ăn vặt văn phòng",
    "snack hub",
  ],
  authors: [{ name: "SkyFood Team" }],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "SkyFood | Thiên đường đồ ăn vặt",
    description: "Khám phá các món ăn vặt ngon tuyệt đỉnh tại SkyFood",
    siteName: "SkyFood",
  },
};

import AuthProvider from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}

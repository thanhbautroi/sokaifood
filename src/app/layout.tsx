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
    default: "V-LIGHT | Đèn học, hoa và đồ trang trí",
    template: "%s | V-LIGHT",
  },
  description:
    "Khám phá đèn học, hoa trang trí, đồ decor và những món đồ tiện ích giúp không gian sống thêm đẹp, tiện nghi và mang dấu ấn riêng.",
  keywords: [
    "đèn học",
    "hoa trang trí",
    "đồ trang trí",
    "đồ decor",
    "phụ kiện nhà cửa",
    "góc học tập",
    "trang trí nhà cửa",
    "đồ dùng tiện ích",
  ],
  authors: [{ name: "V-LIGHT" }],
  icons: {
    icon: "/images/v-light-logo.png",
    apple: "/images/v-light-logo.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "V-LIGHT | Đèn học, hoa và đồ trang trí",
    description: "Khám phá các món đồ tiện dụng và trang trí cho góc học tập, bàn làm việc và ngôi nhà tại V-LIGHT.",
    siteName: "V-LIGHT",
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

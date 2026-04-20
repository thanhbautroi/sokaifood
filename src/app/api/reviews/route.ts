import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId là bắt buộc" },
        { status: 400 }
      );
    }

    const reviews = await Review.find({ productId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const stats = {
      totalReviews: reviews.length,
      averageRating:
        reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0,
      ratingDistribution: {
        5: reviews.filter((r) => r.rating === 5).length,
        4: reviews.filter((r) => r.rating === 4).length,
        3: reviews.filter((r) => r.rating === 3).length,
        2: reviews.filter((r) => r.rating === 2).length,
        1: reviews.filter((r) => r.rating === 1).length,
      },
    };

    return NextResponse.json({ reviews, stats });
  } catch (error) {
    console.error("Lỗi lấy reviews:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { productId, userId, guestName, guestEmail, rating, title, comment } = body;

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "Các trường bắt buộc thiếu" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Đánh giá phải từ 1 đến 5 sao" },
        { status: 400 }
      );
    }

    const review = new Review({
      productId,
      userId,
      guestName,
      guestEmail,
      rating,
      title,
      comment,
      verified: !!userId, // Verified nếu là user đã đăng nhập
    });

    await review.save();

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Lỗi tạo review:", error);
    return NextResponse.json(
      { error: "Lỗi server" },
      { status: 500 }
    );
  }
}

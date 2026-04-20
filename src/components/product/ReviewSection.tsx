"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star, ThumbsUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface Review {
  _id: string;
  productId: string;
  userId?: any;
  guestName?: string;
  guestEmail?: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number | string;
  ratingDistribution: {
    [key: number]: number;
  };
}

export default function ReviewSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    guestName: session?.user?.name || "",
    guestEmail: session?.user?.email || "",
    rating: 5,
    title: "",
    comment: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Lỗi lấy reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.title.trim() || !formData.comment.trim()) {
      setError("Vui lòng điền đủ thông tin");
      return;
    }

    if (formData.title.length < 5) {
      setError("Tiêu đề phải dài ít nhất 5 ký tự");
      return;
    }

    if (formData.comment.length < 10) {
      setError("Bình luận phải dài ít nhất 10 ký tự");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: session?.user ? (session.user as any).id : null,
          guestName: formData.guestName,
          guestEmail: formData.guestEmail,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setFormData({
          guestName: session?.user?.name || "",
          guestEmail: session?.user?.email || "",
          rating: 5,
          title: "",
          comment: "",
        });
        setShowForm(false);
        setTimeout(() => {
          setSuccess(false);
          fetchReviews();
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Có lỗi khi gửi đánh giá");
      }
    } catch (err) {
      setError("Lỗi hệ thống");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-gray-400">Đang tải đánh giá...</div>;
  }

  return (
    <section className="py-16 bg-white border-t border-gray-200">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Đánh giá sản phẩm</h2>

        {/* Stats & Rating Distribution */}
        {stats && stats.totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">
                {stats.averageRating}
              </div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(Number(stats.averageRating))
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">
                {stats.totalReviews} đánh giá
              </p>
            </div>

            <div className="md:col-span-2 space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating] || 0;
                const percentage = stats.totalReviews > 0
                  ? Math.round((count / stats.totalReviews) * 100)
                  : 0;
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-16">
                      {[...Array(rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add Review Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-8 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Viết đánh giá của bạn
          </button>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="mb-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Chia sẻ đánh giá của bạn</h3>

            {error && (
              <div className="mb-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <span className="text-sm text-red-600">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <span className="text-sm text-green-600">Cảm ơn! Đánh giá của bạn đã được gửi.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email */}
              {!session?.user && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Tên của bạn *"
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email của bạn *"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Đánh giá *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          rating <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Sản phẩm tuyệt vời!"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  maxLength={100}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.title.length}/100
                </p>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bình luận *
                </label>
                <textarea
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                  rows={5}
                  maxLength={1000}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.comment.length}/1000
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {review.verified && (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Đã mua
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900">{review.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {review.userId?.name || review.guestName || "Khách"} •{" "}
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-4">{review.comment}</p>

                {review.helpful > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ThumbsUp className="w-4 h-4" />
                    {review.helpful} người thấy hữu ích
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

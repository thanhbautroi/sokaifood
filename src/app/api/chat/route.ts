import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Connect to database and fetch all products
    await dbConnect();
    const products = await Product.find({});

    // Build product context for AI
    const productContext = products
      .map(
        (p) =>
          `- ${p.name} (Slug: ${p.slug}): ${p.description}. Giá: ${p.price.toLocaleString("vi-VN")}đ. Phân loại: ${p.collectionType === "do-cay" ? "Đồ Cay Nội Địa" : p.collectionType === "trai-cay-say" ? "Trái Cây Sấy" : p.collectionType === "cac-loai-hat" ? "Hạt Dinh Dưỡng" : "Đồ Uống Giải Khát"}`
      )
      .join("\n");

    const systemPrompt = `Bạn là trợ lý AI thông minh của SkyFood - thế giới đồ ăn vặt siêu cuốn hút.

DANH SÁCH SẢN PHẨM:
${productContext}

NHIỆM VỤ:
1. Tư vấn và gợi ý món ăn vặt phù hợp với khẩu vị hoặc hoàn cảnh của khách (ví dụ: cày phim, nhậu nhẹt, ăn kiêng).
2. Trả lời câu hỏi về thành phần, vị cay, độ ngọt, khối lượng, giá tiền.
3. Hướng dẫn thêm vào giỏ hàng hoặc check-out.

QUY TẮC:
- Cực kỳ thân thiện, dùng từ ngữ giới trẻ hoặc vui nhộn (mlem mlem, cuốn, dính, cháy phố) (dưới 3 câu).
- Khi khách hỏi tìm món gì, PHẢI gợi ý sản phẩm và chèn thêm block JSON chính xác có từ khóa \`slug\` trong danh sách vào CUỐI câu.
- Cú pháp JSON BẮT BUỘC: {"products": [{"slug": "..."}]}
- Chỉ được lấy slug từ Danh sách sản phẩm bạn được cung cấp. Tuyệt đối không tự bịa slug mới.
- Kết thúc luôn là 1 câu hỏi để giữ tương tác với khách.

VÍ DỤ:
User: "Nay buồn miệng quá có gì nhai ngon không"
Response: "Dạ Skyfood đang có mấy món siêu bánh cuốn giòn giòn nhai rôm rốp luôn ạ! Bạn thích đồ siêu cay hay hạt dinh dưỡng béo bùi hả bạn? {"products": [{"slug": "xoai-say-deo"}, {"slug": "chan-ga-cay-tu-xuyen"}]}"`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API Error: ${response.status}`);
    }

    const data = await response.json();
    let botMessage = data.choices[0]?.message?.content || "Xin lỗi, mình không hiểu. Bạn có thể hỏi lại không?";

    // Extract product suggestions from response
    let suggestedProducts: any[] = [];
    const jsonMatch = botMessage.match(/\{"products":\s*\[.*?\]\}/);

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        const slugs = parsed.products.map((p: { slug: string }) => p.slug);

        // Fetch products from database
        const foundProducts = await Product.find({ slug: { $in: slugs } });

        suggestedProducts = foundProducts.map((product) => ({
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          image: product.images[0] || "/images/placeholder.jpg",
          slug: product.slug,
        }));

        // Remove JSON from message
        botMessage = botMessage.replace(jsonMatch[0], "").trim();
      } catch (e) {
        console.error("Failed to parse product JSON:", e);
      }
    }

    return NextResponse.json({
      message: botMessage,
      products: suggestedProducts,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        message: "Xin lỗi, có lỗi xảy ra. Vui lòng liên hệ hotline: 0123 456 789 để được hỗ trợ!",
        products: [],
      },
      { status: 500 }
    );
  }
}

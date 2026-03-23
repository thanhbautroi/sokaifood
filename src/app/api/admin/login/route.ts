import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "snackhub2026";

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Simple token (in production, use JWT)
      const token = Buffer.from(`${username}:${password}`).toString("base64");

      return NextResponse.json({
        success: true,
        token,
        message: "Đăng nhập thành công",
      });
    }

    return NextResponse.json(
      { success: false, error: "Sai tên đăng nhập hoặc mật khẩu" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Có lỗi xảy ra" },
      { status: 500 }
    );
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userIdParam = searchParams.get("userId");

    if (!userIdParam || isNaN(userIdParam)) {
      return NextResponse.json(
        { message: "Geçerli bir kullanıcı ID'si gerekli." },
        { status: 400 }
      );
    }

    const userId = parseInt(userIdParam, 10);

    const messages = await prisma.message.findMany({
      where: { receiver_id: userId },
      include: {
        sender: {
          select: { name: true, surname: true, email: true },
        },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Mesajlar alınamadı:", error);
    return NextResponse.json(
      { message: "Mesajlar alınırken sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}

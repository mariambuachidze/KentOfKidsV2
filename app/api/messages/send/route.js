import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const body = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim." }, { status: 401 });
  }

  const { email, title, description, senderId } = body;

  try {
    const receiver = await prisma.user.findUnique({
      where: { email },
    });

    if (!receiver) {
      return NextResponse.json({ message: "Bu e-posta adresine sahip bir kullanıcı bulunamadı." }, { status: 404 });
    }

    await prisma.message.create({
      data: {
        sender_id: senderId,
        receiver_id: receiver.id,
        title,
        description,
      },
    });

    return NextResponse.json({ message: "Mesaj başarıyla gönderildi." }, { status: 200 });

  } catch (error) {
    console.error("Mesaj gönderilirken hata:", error);
    return NextResponse.json({ message: "Mesaj gönderilemedi." }, { status: 500 });
  }
}

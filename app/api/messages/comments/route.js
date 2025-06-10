import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get("userId"));

  if (isNaN(userId)) {
    return NextResponse.json({ message: "Geçersiz userId" }, { status: 400 });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: {
        user_id: userId,
      },
      include: {
        replies: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!comments) {
      return NextResponse.json({ message: "Yorum bilgileri alınamadı" }, { status: 500 });
    }

    const allReplies = comments.flatMap(comment => comment.replies);
    return NextResponse.json(allReplies);
  } catch (error) {
    console.error("CommentReply fetch error:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

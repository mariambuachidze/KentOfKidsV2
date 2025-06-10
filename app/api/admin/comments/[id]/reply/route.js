// app/api/admin/comments/[id]/reply/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// POST /api/admin/comments/[id]/reply - Reply to a comment
export async function POST(request, { params }) {
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const commentId = parseInt(params.id);
    const { reply } = await request.json();

    const commentReply = await prisma.commentReply.create({
      data: {
        comment_id: commentId,
        user_id: auth.user.id,
        reply
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            is_admin: true
          }
        }
      }
    });

    return NextResponse.json(commentReply, { status: 201 });
  } catch (error) {
    console.error('Error replying to comment:', error);
    return NextResponse.json({ message: 'Failed to reply to comment' }, { status: 500 });
  }
}

// DELETE /api/admin/comments/[id]/reply?replyId=123 - Delete a reply
export async function DELETE(request, { params }) {
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(request.url);
  const replyId = parseInt(searchParams.get("replyId"));

  if (!replyId) {
    return NextResponse.json({ message: 'replyId parametresi gerekli' }, { status: 400 });
  }

  try {
    const existingReply = await prisma.commentReply.findUnique({
      where: { id: replyId }
    });

    if (!existingReply) {
      return NextResponse.json({ message: 'Yanıt bulunamadı' }, { status: 404 });
    }

    await prisma.commentReply.delete({
      where: { id: replyId }
    });

    return NextResponse.json({ message: 'Yorum yanıtı silindi' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting reply:', error);
    return NextResponse.json({ message: 'Yanıt silinemedi' }, { status: 500 });
  }
}

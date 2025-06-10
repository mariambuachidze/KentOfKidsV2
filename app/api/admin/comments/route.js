// app/api/admin/comments/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// GET /api/admin/comments - Get all comments
export async function GET(request) {
  // Check if user is admin
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                is_admin: true
              }
            }
          }
        }
      }
    });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ message: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request) {

  // const auth = await isAdmin(request);
  // if (auth.error) {
  //   return NextResponse.json({ message: auth.error }, { status: auth.status });
  // }

  try {
    const body = await request.json();
    const { title, description, rating, userId, productId } = body;

    // Doğrulama
    if (!title || !description || !rating || !userId || !productId) {
      return NextResponse.json({ message: 'Eksik veya geçersiz veri gönderildi.' }, { status: 400 });
    }

    // Yorum oluştur
    const newComment = await prisma.comment.create({
      data: {
        title,
        description,
        rating,
        user_id: userId,
        product_id: productId
      }
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Yorum eklenirken hata oluştu:', error);
    return NextResponse.json({ message: 'Yorum eklenemedi.' }, { status: 500 });
  }
}

// app/api/admin/categories/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// GET /api/admin/categories - Tüm kategorileri ve ürün sayısını getir
export async function GET(request) {
  // const auth = await isAdmin(request);
  // if (auth.error) {
  //   return NextResponse.json({ message: auth.error }, { status: auth.status });
  // }

  try {
    const categories = await prisma.category.findMany({
      include: {
        products: true 
      }
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Kategoriler alınamadı' }, { status: 500 });
  }
}

// POST /api/admin/categories - Yeni kategori oluştur
export async function POST(request) {
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { name } = await request.json();
    const category = await prisma.category.create({
      data: { name }
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Kategori oluşturulamadı' }, { status: 500 });
  }
}

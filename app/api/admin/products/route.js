
// app/api/admin/products/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

export async function GET(request) {

  try {
    const products = await prisma.product.findMany({
      include: {
        stock: true,
        category: true
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ message: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST /api/admin/products - Create product
export async function POST(request) {
  // Check if user is admin
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const { name, description, price, image_url, category_id, quantity } = await request.json();

    // Create product in a transaction to ensure both product and stock are created
    const product = await prisma.$transaction(async (prisma) => {
      // Create product
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          image_url,
          category_id: parseInt(category_id)
        }
      });

      if(!quantity || isNaN(quantity) || parseInt(quantity) < 0) {
        return NextResponse.json({ message: 'Invalid quantity' }, { status: 400 });
      }
      // Create stock entry for the product
      await prisma.stock.create({
        data: {
          product_id: newProduct.id, // id olan alan primary key
          quantity: parseInt(quantity)
        }
      });

      return newProduct;
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ message: 'Failed to create product' }, { status: 500 });
  }
}
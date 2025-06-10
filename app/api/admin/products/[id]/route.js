// app/api/admin/products/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// PUT /api/admin/products/[id] - Update product
export async function PUT(request, { params }) {
  // Check if user is admin
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const productId = parseInt(params.id);
    const { name, description, price, image_url, category_id, quantity } = await request.json();

    const updatedProduct = await prisma.$transaction(async (prisma) => {
      // Update product
      const product = await prisma.product.update({
        where: { id: productId },
        data: {
          name,
          description,
          price: parseFloat(price),
          image_url,
          category_id: parseInt(category_id)
        }
      });

      // Update stock if quantity is provided
      if (quantity !== undefined) {
        await prisma.stock.upsert({
          where: { product_id: productId },
          update: { quantity: parseInt(quantity) },
          create: { 
            product_id: productId,
            quantity: parseInt(quantity)
          }
        });
      }

      return product;
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ message: 'Failed to update product' }, { status: 500 });
  }
}


export async function DELETE(request, { params }) {
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const productId = parseInt(params.id);

    await prisma.$transaction(async (prisma) => {
      await prisma.comment.deleteMany({
        where: { product_id: productId },
      });

      await prisma.stock.deleteMany({
        where: { product_id: productId },
      });

      // Delete the product
      await prisma.product.delete({
        where: { id: productId },
      });
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Failed to delete product' }, { status: 500 });
  }
}


export async function GET(request, { params }) {

  try {
    const productId = parseInt(params.id);

    // Get product by ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,  // Category information if needed
        stock: true,     // Stock information if needed
      }
    });

    // If product not found, return 404
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    // Return the product
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ message: 'Failed to fetch product' }, { status: 500 });
  }
}

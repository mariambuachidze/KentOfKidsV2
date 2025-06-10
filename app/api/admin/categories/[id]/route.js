// app/api/admin/categories/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// PUT /api/admin/categories/[id] - Update category
export async function PUT(request, { params }) {
  // Check if user is admin
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const categoryId = parseInt(params.id);
    const { name } = await request.json();
    const category = await prisma.category.update({
      where: { id: categoryId },
      data: { name }
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ message: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(request, { params }) {
  // Check if user is admin
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const categoryId = parseInt(params.id);
    
    // Check if there are any products in this category
    const productsCount = await prisma.product.count({
      where: { category_id: categoryId }
    });
    
    if (productsCount > 0) {
      return NextResponse.json({ 
        message: `Cannot delete category with ${productsCount} associated products. Please reassign or delete these products first.` 
      }, { status: 400 });
    }
    
    await prisma.category.delete({
      where: { id: categoryId }
    });
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ message: 'Failed to delete category' }, { status: 500 });
  }
}
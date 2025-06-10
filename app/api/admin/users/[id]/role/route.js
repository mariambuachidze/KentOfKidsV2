// app/api/admin/users/[id]/role/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// PATCH /api/admin/users/[id]/role - Change user role (toggle admin status)
export async function PATCH(request, { params }) {
  // Check if user is admin
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const userId = parseInt(params.id);
    const { is_admin } = await request.json();

    // Don't allow users to remove their own admin status
    if (userId === auth.user.id && is_admin === false) {
      return NextResponse.json({ message: 'Cannot remove your own admin privileges' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { is_admin },
      select: {
        id: true,
        name: true,
        email: true,
        is_admin: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ message: 'Failed to update user role' }, { status: 500 });
  }
}
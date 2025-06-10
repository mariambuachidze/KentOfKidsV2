// app/api/admin/users/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

export async function DELETE(request, { params }) {
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const userId = parseInt(params.id);
    
    // Prevent admins from deleting themselves
    if (userId === auth.user.id) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 });
    }

    await prisma.$transaction(async (prisma) =>{
      await prisma.message.deleteMany({
        where: {
          OR: [
            { sender_id: userId },
            { receiver_id: userId }
          ]
        }
      });
      
      await prisma.commentReply.deleteMany({
        where: { user_id: userId }
      });
      
      await prisma.comment.deleteMany({
        where: { user_id: userId }
      });
      await prisma.appointmentReply.deleteMany({
        where: { user_id: userId }
      });
      await prisma.appointment.deleteMany({
        where: { user_id: userId }
      });
      await prisma.user.delete({
        where: { id: userId }
      });


    })

    return NextResponse.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Failed to delete user' }, { status: 500 });
  }
}
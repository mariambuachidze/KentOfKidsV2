// app/api/admin/comments/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// DELETE /api/admin/comments/[id] - Delete a comment
export async function DELETE(request, { params }) {
  // Check if user is admin
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const commentId = parseInt(params.id);
    
    // Delete all replies to this comment
    await prisma.commentReply.deleteMany({
      where: { comment_id: commentId }
    });
    
    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId }
    });
    
    return NextResponse.json({ message: 'Comment and all replies deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ message: 'Failed to delete comment' }, { status: 500 });
  }
}
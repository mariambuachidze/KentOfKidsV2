import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// POST /api/appointments/[id]/reply - Randevuya yanıt ver
export async function POST(request, { params }) {
  console.log("POST /reply çalıştı");
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const appointmentId = parseInt(params.id);
    const { reply } = await request.json();

    const appointmentReply = await prisma.appointmentReply.create({
      data: {
        appointment_id: appointmentId,
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

    return NextResponse.json(appointmentReply, { status: 201 });
  } catch (error) {
    console.log("sikoook")
    console.error('Error replying to appointment:', error);
    return NextResponse.json({ message: 'Randevuya yanıt verilemedi' }, { status: 500 });
  }
}

// DELETE /api/appointments/[id]/reply?replyId=xxx - Belirli bir yanıtı sil
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
    const existingReply = await prisma.appointmentReply.findUnique({
      where: { id: replyId }
    });

    if (!existingReply) {
      return NextResponse.json({ message: 'Yanıt bulunamadı' }, { status: 404 });
    }

    await prisma.appointmentReply.delete({
      where: { id: replyId }
    });

    return NextResponse.json({ message: 'Yanıt başarıyla silindi' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting appointment reply:', error);
    return NextResponse.json({ message: 'Yanıt silinemedi' }, { status: 500 });
  }
}

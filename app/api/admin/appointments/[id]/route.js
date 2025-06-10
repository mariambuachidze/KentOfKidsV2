import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/app/middleware/adminAuth';

const prisma = new PrismaClient();

// PUT /api/admin/appointments/[id] - Randevuyu güncelle
export async function PUT(request, { params }) {
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const appointmentId = parseInt(params.id);
    const { description, date, time } = await request.json();

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        description,
        date: new Date(date),
        time: new Date(time)
      }
    });

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ message: 'Randevu güncellenemedi' }, { status: 500 });
  }
}

// DELETE /api/admin/appointments/[id] - Randevuyu sil
export async function DELETE(request, { params }) {
  const auth = await isAdmin(request);
  if (auth.error) {
    return NextResponse.json({ message: auth.error }, { status: auth.status });
  }

  try {
    const appointmentId = parseInt(params.id);

    // Önce yanıtları sil (foreign key problemi olmaması için)
    await prisma.appointmentReply.deleteMany({
      where: { appointment_id: appointmentId }
    });

    await prisma.appointment.delete({
      where: { id: appointmentId }
    });

    return NextResponse.json({ message: 'Randevu başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ message: 'Randevu silinemedi' }, { status: 500 });
  }
}

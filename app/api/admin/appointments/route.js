import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (session.user.isAdmin) {
      const appointments = await prisma.appointment.findMany({
        where: userId ? { user_id: parseInt(userId) } : {},
        include: {
          user: {
            select: {
              id: true,
              name: true,
              surname: true,
              email: true,
              phone_number: true,
            },
          },
          replies: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  surname: true,
                  email:true
                },
              },
            },
          },
        },
        orderBy: { date: "desc" },
      });

      return NextResponse.json(appointments);
    }

    // Normal kullanıcı sadece kendi randevularını görebilir
    const appointments = await prisma.appointment.findMany({
      where: { user_id: session.user.id },
      include: {
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments" },
      { status: 500 }
    );
  }
}


export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { description, date } = await request.json();
    if (!description || !date)
      return NextResponse.json({ error: "Eksik alanlar" }, { status: 400 });

    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime()))
      return NextResponse.json({ error: "Geçersiz tarih formatı" }, { status: 400 });

    const appointment = await prisma.appointment.create({
      data: {
        user_id: session.user.id,
        description,
        date: appointmentDate,
        time: appointmentDate,
      },
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json({ error: "Randevu oluşturulamadı" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, description, date, time } = await request.json();
    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

    const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });
    if (!appointment) return NextResponse.json({ error: "Randevu bulunamadı" }, { status: 404 });

    if (appointment.user_id !== session.user.id && !session.user.isAdmin)
      return NextResponse.json({ error: "Erişim reddedildi" }, { status: 403 });

    const updated = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        description: description || appointment.description,
        date: date ? new Date(date) : appointment.date,
        time: time ? new Date(time) : appointment.time,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating appointment:", error);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID gerekli" }, { status: 400 });

    const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });
    if (!appointment) return NextResponse.json({ error: "Randevu bulunamadı" }, { status: 404 });

    if (appointment.user_id !== session.user.id && !session.user.isAdmin)
      return NextResponse.json({ error: "Erişim reddedildi" }, { status: 403 });

    await prisma.appointmentReply.deleteMany({ where: { appointment_id: appointment.id } });
    await prisma.appointment.delete({ where: { id: appointment.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json({ error: "Silme başarısız" }, { status: 500 });
  }
}

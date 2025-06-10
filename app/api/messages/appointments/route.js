// /app/api/admin/appointments/byUserId/route.js

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get("userId"));

  if (!userId) {
    return NextResponse.json({ message: "userId gerekli" }, { status: 400 });
  }

  try{
    const appointment = await prisma.appointment.findMany({
      where: {
        user_id: userId,
      },
      include: {
        replies: {
          include: {
            user: true,
          },
        },
      },
    });
    if(!appointment){
      return NextResponse.json({ message: "randevu bilgileri alınamadı" }, { status: 500 });
    }
    const allReplies = appointment.flatMap(app => app.replies);
    return NextResponse.json(allReplies);
    // userId = appointment.user.id;
  }
  catch(e){
    return NextResponse.json({ message: "user Id alınamadı" }, { status: 400 });
  }

}

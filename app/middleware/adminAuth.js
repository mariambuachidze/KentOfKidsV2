// app/middleware/adminAuth.js
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function isAdmin(request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session.user.id
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { error: 'Yetkisiz: Kullanıcı bulunamadı', status: 401 };
    }

    if (!user.is_admin) {
      return { error: 'Erişim reddedildi: Yönetici yetkisi gerekli', status: 403 };
    }

    return { user };
  } catch (error) {
    console.error('Admin auth error:', error);
    return { error: 'Kimlik doğrulama başarısız', status: 401 };
  }
}

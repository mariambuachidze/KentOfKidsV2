import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }


  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
      name: true,
      surname: true,
      phone_number: true,
      email: true,
      is_admin: true,
    },
  });

  
console.log(user)

  if (!user) {
    console.log(user)
    redirect("/profile");
  }

  return (
    <main>
      {/* Profile Form Section */}
      <section className="py-16 bg-gray-25">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Profil Bilgileri
              </h2>
              <ProfileForm user={user} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
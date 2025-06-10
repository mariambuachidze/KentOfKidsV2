import { Inter, Montserrat } from "next/font/google";
import { getServerSession } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import AuthProvider from "./AuthProvider";
import MessageIcon from '@/components/MessageIcon';
import { authOptions } from "@/lib/auth";

// Font declarations
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Kent Of Kids - Çocuklar İçin'Giyim Mağazası",
  description: "Quality children's clothing for all ages and occasions",
};

export default async function RootLayout({ children }) {
  const authSession = await getServerSession(authOptions);
  const userId = authSession?.user?.id || null;
  const session = await getServerSession();

  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="flex flex-col min-h-screen">
        <AuthProvider session={session}>
          <Header />
          <main className="flex-grow">{children}</main>
          {userId && (
            <div className="fixed-message-icon">
              <MessageIcon userId={userId} />
            </div>
          )}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

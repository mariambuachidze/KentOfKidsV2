import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
      
        if (!user) {
          console.log('User not found');
          return null;
        }
      
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          console.log('Invalid password');
          return null;
        }
      
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin
        };
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Token'dan gelen id ve isAdmin bilgilerini session'a ekliyoruz
      session.user.id = token.id;
      session.user.isAdmin = token.isAdmin;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    }
  }
});

export { handler as GET, handler as POST };

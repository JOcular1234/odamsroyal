// frontend/src/pages/api/auth/[`nextauth`].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Simple hardcoded admin user (replace with DB lookup in production)
        if (
          credentials.username === 'admin' &&
          credentials.password === 'admin123'
        ) {
          return { id: 1, name: 'Admin', email: 'admin@odamzroyal.com', role: 'admin' };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
}); 
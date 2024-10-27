import { IAdministrator, IAdministratorLogin } from "@/interfaces/admin";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import api from "@/app/services/api";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('Credenciais não fornecidas.');

        try {
          const response = await api.post<IAdministratorLogin>('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { admin, access_token: token } = response.data.data;

          if (!admin || !token) throw new Error('Falha na autenticação: falta de dados do administrador ou do token.');

          return { ...admin, token };
        }catch(error: any){
          console.error('Erro na função de autorização:', error);
          if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
          }
          throw new Error('Falha na autenticação.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.admin = user as IAdministrator;
        token.token = (user as any).token;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.admin) {
        session.admin = token.admin;
      }
      if (token.token) {
        session.token = token.token;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/',
    signOut: '/auth/administrador-entrar',
  }
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };

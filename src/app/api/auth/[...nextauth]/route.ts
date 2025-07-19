import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken?: string;
  }
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://tipme-backend-s3nk.onrender.com";

const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userMail: { label: "Email", type: "text" },
        userPassword: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.userMail || !credentials?.userPassword) {
          return null;
        }

        try {
          const res = await fetch(`${backendUrl}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userMail: credentials.userMail,
              userPassword: credentials.userPassword,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.token?.token) {
            console.log("Login falhou");
            return null;
          }

          const tokenValue = data.token.token;

          // ← Retornar apenas o token (demais dados serão buscados no jwt())
          return {
            id: data.token.user?.userId || "",
            email: credentials.userMail,
            accessToken: tokenValue,
          };

        } catch (error) {
          console.error("Erro:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Quando o login acontece
      if (user || trigger === "update") {
        const acesssToken = user?.accessToken || token.accessToken;

        if (!acesssToken) {
          console.error("Token não encontrado");
          return token;
        }

        try { 

          const res = await fetch(`${backendUrl}/users/all-info`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${acesssToken}`,
            }
          },
        );

          const userData = await res.json();

          token.userId = userData.userId;
          token.userName = userData.userName;
          token.artistName = userData.artistName;
          token.bio = userData.bio;
          token.userMail = userData.userMail;
          token.userAvatar = userData.userAvatar;
          token.userLink1 = userData.userLink1;
          token.userLink2 = userData.userLink2;
          token.userLink3 = userData.userLink3;
          token.accessToken = acesssToken;

        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.id = token.userId as string;
      session.user.email = token.userMail as string;
      session.user.userName = token.userName as string;
      session.user.artistName = token.artistName as string;
      session.user.bio = token.bio as string;
      session.user.avatar = token.userAvatar as string ?? null;
      session.user.userLink1 = token.userLink1 as string ?? null;
      session.user.userLink2 = token.userLink2 as string ?? null;
      session.user.userLink3 = token.userLink3 as string ?? null;

      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

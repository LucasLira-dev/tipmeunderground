// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      soundCloud: string;
      id: string;
      email: string;
      userName: string;
      artistName: string;
      bio: string;
      avatar: string | null;
      userLink1?: string | null;
      userLink2?: string | null;
      userLink3?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    userName?: string;
    artistName?: string;
    bio?: string;
    avatar?: string | null;
    token?: string; // usado na callback jwt
    userLink1?: string | null;
    userLink2?: string | null;
    userLink3?: string | null;
  }

  interface JWT {
    accessToken?: string;
    userId?: string;
    userMail?: string;
    userName?: string;
    artistName?: string;
    bio?: string;
    userAvatar?: string | null;
    userLink1?: string | null;
    userLink2?: string | null;
    userLink3?: string | null;
  }
}

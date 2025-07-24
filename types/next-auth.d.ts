import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string; // 👈 добавляем недостающее поле
  }

  interface TokenSet {
    access_token?: string;
    provider?: string;
  }
}

import { DefaultSession } from "next-auth";

// Extend User Type to Include `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // 👈 Ensure `id` exists in session.user
    } & DefaultSession["user"];
  }
}
import { DefaultSession } from "next-auth";

// Extend User Type to Include `id`
declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
    } & DefaultSession["user"];
  }
}
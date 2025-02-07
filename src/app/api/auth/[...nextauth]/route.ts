import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
    {
      id: "solid",
      name: "Solid",
      type: "oauth",
      wellKnown: "https://broker.pod.inrupt.com/.well-known/openid-configuration", // Solid OIDC
      authorization: {
        url: "https://broker.pod.inrupt.com/authorize",
        params: { scope: "openid webid" },
      },
      token: "https://broker.pod.inrupt.com/token",
      userinfo: "https://broker.pod.inrupt.com/userinfo",
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name || "Solid User",
          email: profile.email || "",
          webid: profile.webid, // Solid uses WebID instead of email
        };
      },
      clientId: process.env.SOLID_CLIENT_ID!,
      clientSecret: process.env.SOLID_CLIENT_SECRET!,
    },
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (token?.sub) {
        session.user = {
          ...session.user,
          id: token.sub,
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
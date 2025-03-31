    import NextAuth, { NextAuthOptions } from "next-auth";
    import GoogleProvider from "next-auth/providers/google";
    import KeycloakProvider from "next-auth/providers/keycloak";
    import { getPkceStatus } from "@/utils/pkceToggle";

    const pkceEnabled = getPkceStatus();

    export const authOptions: NextAuthOptions = {
      providers: [
        // Standard Google provider
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          checks: pkceEnabled ? ["pkce", "state"] : ["state"],
        }),
        // Standard Keycloak provider
        KeycloakProvider({
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
          issuer: process.env.KEYCLOAK_ISSUER!,
          checks: pkceEnabled ? ["pkce", "state"] : ["state"],
        }),
        // Custom Google provider using a custom callback route
        GoogleProvider({
          id: "googleCustom",
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          authorization: {
            params: {
              redirect_uri: "http://localhost:3000/api/auth/callback-custom/google",
            },
          },
          checks: pkceEnabled ? ["pkce", "state"] : ["state"],
        }),
        // Custom Keycloak provider using a custom callback route
        KeycloakProvider({
          id: "keycloakCustom",
          clientId: process.env.KEYCLOAK_CLIENT_ID!,
          clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
          issuer: process.env.KEYCLOAK_ISSUER!,
          authorization: {
            params: {
              redirect_uri: "http://localhost:3000/api/auth/callback-custom/keycloak",
            },
          },
          checks: pkceEnabled ? ["pkce", "state"] : ["state"],
        }),
        // ...any other providers
      ],
      callbacks: {
        // This callback is called once the OAuth provider returns with the authorization code
        // and before NextAuth finalizes the sign-in process.
        async signIn({}) {
          // 2-minute delay (in milliseconds) = 120000
          await new Promise((resolve) => setTimeout(resolve, 0));
          // Returning 'true' allows the sign-in process to continue after the delay
          return true;
        },
      },
      secret: process.env.NEXTAUTH_SECRET,
    };

    const handler = NextAuth(authOptions);
    export { handler as GET, handler as POST };
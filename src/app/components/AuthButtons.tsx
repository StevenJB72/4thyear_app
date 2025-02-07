"use client"; // This makes it a client component

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  return (
    <div>
      {!session ? (
        <>
          <button onClick={() => signIn("google")}>Login with Google</button>
          <button onClick={() => signIn("keycloak")}>Login with Keycloak</button>
          
        </>
      ) : (
        <>
          <p>Welcome, {session.user?.name}!</p>
          <button onClick={() => signOut()}>Logout</button>
        </>
      )}
    </div>
  );
}
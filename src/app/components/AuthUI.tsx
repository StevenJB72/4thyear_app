"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthUI() {
  const { data: session } = useSession();

  return (  
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        {session ? (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {session.user?.name},{session.user?.email}</h1>
            <p className="text-gray-600 mb-6">You are logged in.</p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to the PKCE test app</h1>
            <p className="text-gray-600 mb-6">Sign in to continue</p>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full mb-3"
              onClick={() => signIn("google")}
            >
              Login with Google
            </button>
            <button
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg w-full mb-3"
              onClick={() => signIn("keycloak")}
            >
              Login with Keycloak
            </button>
            <button
               className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full"
                onClick={() => signIn("solid")}
                    >
               Login with Solid
            </button>
          </>
        )}
      </div>
    </div>
  );
}
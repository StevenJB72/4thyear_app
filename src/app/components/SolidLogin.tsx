"use client";
import React, { useEffect } from "react";
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";

const SolidLogin = () => {
  useEffect(() => {
    // Process the redirect once the authentication flow returns
    async function initAuth() {
      await handleIncomingRedirect();
      const session = getDefaultSession();
      if (session.info.isLoggedIn) {
        console.log("Logged in! WebID:", session.info.webId);
      }
    }
    initAuth();
  }, []);

  const handleLogin = async () => {
    await login({
      oidcIssuer: process.env.NEXT_PUBLIC_SOLID_ISSUER!,
      redirectUrl: window.location.href,
      clientName: "My Solid App", // This is the name of your application
    });
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <button onClick={handleLogin}>Login with Solid</button>
    </div>
  );
};

export default SolidLogin;

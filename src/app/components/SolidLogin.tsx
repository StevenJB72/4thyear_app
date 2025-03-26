"use client";

import React, { useEffect, useState } from "react";
import {
  login,
  handleIncomingRedirect,
  getDefaultSession,
} from "@inrupt/solid-client-authn-browser";
import {
  getSolidDataset,
  getThing,
  getStringNoLocale,
} from "@inrupt/solid-client";
// Common vocabularies (FOAF, VCARD, etc.)
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export default function SolidLogin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [webId, setWebId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Handle redirect from Solid on component mount
  useEffect(() => {
    (async () => {
      // This processes the incoming redirect (if any) and updates the default session
      await handleIncomingRedirect();

      const session = getDefaultSession();
      if (session.info.isLoggedIn) {
        setIsLoggedIn(true);
        setWebId(session.info.webId ?? null);
        // Once we have the WebID, we can fetch profile data
        if (session.info.webId) {
          await fetchProfileData(session.info.webId);
        }
      }
    })();
  }, []);

  // Function to log in with Solid
  const solidLogin = async () => {
    await login({
      oidcIssuer: "https://solidcommunity.net", // Or your chosen Solid provider
      redirectUrl: window.location.href, // Return here after login
      clientName: "PKCE Dissertation App", // Shown on the login page
    });
  };

  // Fetch the user's profile data from their WebID
  const fetchProfileData = async (webIdUrl: string) => {
    try {
      const session = getDefaultSession();
      // Load the WebID document/profile
      const profileDataset = await getSolidDataset(webIdUrl, { fetch: session.fetch });
      // The profile "thing" is typically the same as the WebID URL
      const profileThing = getThing(profileDataset, webIdUrl);

      if (!profileThing) {
        console.warn("No profile found at:", webIdUrl);
        return;
      }

      // Try to get the user's name (using FOAF)
      const userName = getStringNoLocale(profileThing, FOAF.name);
      setName(userName ?? null);

      // Try to get the user's email (commonly stored under VCARD.email or FOAF.mbox)
      // This might not always exist
      const userEmail = getStringNoLocale(profileThing, VCARD.email);
      setEmail(userEmail ?? null);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  // Log out function
  const solidLogout = async () => {
    const session = getDefaultSession();
    await session.logout();
    setIsLoggedIn(false);
    setWebId(null);
    setName(null);
    setEmail(null);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Solid Login Demo</h2>
      {isLoggedIn ? (
        <div>
          <p>You are logged in!</p>
          <p><strong>WebID:</strong> {webId}</p>
          <p><strong>Name:</strong> {name || "Unknown"}</p>
          <p><strong>Email:</strong> {email || "Unknown"}</p>
          <button onClick={solidLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <button onClick={solidLogin}>Login with Solid</button>
        </div>
      )}
    </div>
  );
}

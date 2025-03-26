"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";

// -------------------------
// Inline Style Constants
// -------------------------
const containerStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  boxShadow: "0px 0px 20px rgba(80, 120, 255, 0.7)",
  backdropFilter: "blur(8px)",
};

const buttonBaseClasses =
  "text-white font-bold py-2 px-4 rounded-lg w-full transition-all duration-300 hover:shadow-lg";

// Mapping for provider-specific button colors
const providerStyles: Record<string, string> = {
  google: "bg-blue-500 hover:bg-blue-600",
  keycloak: "bg-purple-500 hover:bg-purple-600",
  solid: "bg-green-500 hover:bg-green-600",
};

// Mapping for custom provider IDs (attack demo mode) for Google and Keycloak
const customProviderMap: Record<string, string> = {
  google: "googleCustom",
  keycloak: "keycloakCustom",
};

export default function AuthUI() {
  // Fetch session data from NextAuth
  const { data: session } = useSession();

  // State for PKCE toggle (on/off)
  const [pkceEnabled, setPkceEnabled] = useState(false);
  // State for Attack Demo Mode toggle
  const [attackDemo, setAttackDemo] = useState(false);

  // ============================
  // Fetch PKCE status from the backend on mount
  // ============================
  useEffect(() => {
    fetch("/api/get-pkce-status")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched PKCE status:", data);
        setPkceEnabled(data.pkceEnabled ?? false);
      })
      .catch((error) => console.error("Failed to fetch PKCE settings:", error));
  }, []);

  // ============================
  // Function to toggle PKCE on/off and update backend accordingly
  // ============================
  const togglePkce = async () => {
    const newStatus = !pkceEnabled;
    try {
      const res = await fetch("/api/toggle-pkce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enable: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update PKCE state");
      const data = await res.json();
      setPkceEnabled(data.enabled);
      console.log("PKCE successfully updated:", data.enabled);
    } catch (error) {
      console.error("Error updating PKCE state:", error);
    }
  };

  // ============================
  // Function to toggle Attack Demo Mode
  // ============================
  const toggleAttackDemo = () => {
    setAttackDemo(!attackDemo);
  };

  // ============================
  // Helper: Determines provider ID and callback URL based on attackDemo state
  // For Google and Keycloak, if attack demo mode is active, use the custom provider and callback.
  // For Solid, always use the normal flow.
  // ============================
  const getProviderAndCallback = (provider: string) => {
    if (attackDemo && (provider === "google" || provider === "keycloak")) {
      return {
        id: customProviderMap[provider],
        callbackUrl: `http://localhost:3000/api/auth/callback-custom/${provider}`,
      };
    } else {
      return {
        id: provider,
        // Omit callbackUrl in normal flow so NextAuth uses its default configured route.
        callbackUrl: undefined,
      };
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen w-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#4f46e5] animate-gradient"></div>

      {/* Main Container */}
      <div
        className="relative border border-gray-500 p-8 rounded-xl shadow-lg text-center w-[90%] max-w-[600px] min-w-[425px] mx-auto"
        style={containerStyle}
      >
        {session ? (
          // ---------------------------
          // Logged-In State: Display user information
          // ---------------------------
          <>
            <div className="flex justify-center">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-lg object-cover"
                />
              ) : (
                <div className="flex items-center justify-center w-24 h-24 rounded-full border-4 border-blue-400 shadow-lg bg-gray-300 text-black">
                  Photo
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mt-4">
              Welcome, {session.user?.name}
            </h1>
            <p className="text-gray-300 mb-2">Email: {session.user?.email}</p>
            <p className="text-gray-300 mb-6">You are logged in.</p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </>
        ) : (
          // ---------------------------
          // Not Logged-In State: Display login UI with buttons and toggles
          // ---------------------------
          <>
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to the PKCE Test App
            </h1>
            <p className="text-gray-300 mb-6">Sign in to continue</p>
            {/* Login Buttons */}
            <div className="space-y-4">
              {["google", "keycloak", "solid"].map((provider) => {
                const { id, callbackUrl } = getProviderAndCallback(provider);
                return (
                  <button
                    key={provider}
                    className={`${buttonBaseClasses} ${providerStyles[provider]}`}
                    onClick={() => signIn(id, { callbackUrl })}
                  >
                    {`Login with ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
                  </button>
                );
              })}
            </div>
            {/* PKCE Toggle */}
            <div className="mt-6">
              <h2 className="text-white font-bold mb-2">PKCE OFF/ON</h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={pkceEnabled}
                  onChange={togglePkce}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-800 border border-gray-600 rounded-full shadow-inner peer-checked:bg-neon-glow peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
              </label>
            </div>
            {/* Attack Demo Mode Toggle */}
            <div className="mt-4">
              <h2 className="text-white font-bold mb-2">Attack Demo Mode</h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={attackDemo}
                  onChange={toggleAttackDemo}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-800 border border-gray-600 rounded-full shadow-inner peer-checked:bg-neon-glow peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all"></div>
              </label>
            </div>
          </>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 300% 300%;
          animation: gradient 5s ease infinite;
        }
        .peer-checked.bg-neon-glow {
          background: linear-gradient(90deg, #00ffea, #00f7ff);
          box-shadow: 0 0 10px #00f7ff;
        }
      `}</style>
    </div>
  );
}
// File: /src/app/api/auth/callback-custom/google/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  console.log("Custom callback received:");
  console.log("Code:", code);
  console.log("State:", state);

  // Redirect to the standard NextAuth callback to complete the login flow
  const redirectUrl = new URL("http://localhost:3000/api/auth/callback/google");
  if (code) redirectUrl.searchParams.set("code", code);
  if (state) redirectUrl.searchParams.set("state", state);
  return NextResponse.redirect(redirectUrl);
}
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  console.log("Custom Keycloak callback received:");
  console.log("Authorization Code:", code);
  console.log("State:", state);

  // Immediately stop the flow by returning the intercepted code as JSON.
  return NextResponse.json({
    message: "Keycloak code intercepted for testing. Flow halted.",
    code,
    state,
  });
}
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  console.log("Custom Google callback received:");
  console.log("Authorization Code:", code);
  console.log("State:", state);

  // Immediately halt the flow and return the intercepted code as JSON for manual testing.
  return NextResponse.json({
    message: "Google code intercepted for testing. Flow halted.",
    code,
    state,
  });
}
import { NextResponse } from "next/server";
import { setPkceStatus } from "../../../utils/pkceToggle";

export async function POST(req: Request) {
  try {
    const { enable } = await req.json();
    setPkceStatus(enable);
    return NextResponse.json({ success: true, enabled: enable });
  } catch (error: unknown) {
    console.error("PKCE Toggle API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
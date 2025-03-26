import { NextResponse } from "next/server";
import { getPkceStatus } from "../../../utils/pkceToggle";

export async function GET() {
  return NextResponse.json({ pkceEnabled: getPkceStatus() });
}
import { NextResponse } from "next/server";

import {
  getShortimizeStatus,
  parseShortimizeCookie,
  saveShortimizeCredentials,
} from "@/lib/vendors/shortimize";

export async function GET() {
  const status = await getShortimizeStatus();
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { cookieValue, organisationId } = body as {
    cookieValue?: string;
    organisationId?: string;
  };

  if (!cookieValue || !organisationId) {
    return NextResponse.json(
      { error: "cookieValue and organisationId are required" },
      { status: 400 }
    );
  }

  try {
    parseShortimizeCookie(cookieValue);
  } catch {
    return NextResponse.json(
      { error: "Invalid cookie value. Make sure you copied the full sb-*-auth-token cookie." },
      { status: 400 }
    );
  }

  await saveShortimizeCredentials(cookieValue, organisationId);
  const status = await getShortimizeStatus();

  return NextResponse.json(status);
}

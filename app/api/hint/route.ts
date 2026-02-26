import { NextRequest, NextResponse } from "next/server";

/**
 * Stub: returns a short generic hint. Replace with real logic (e.g. LLM) later.
 * Accepts POST JSON: { prompt?: string; questionId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    await request.json().catch(() => ({}));
    return NextResponse.json({
      hint: "Consider breaking the problem into smaller steps, or try a concrete example.",
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

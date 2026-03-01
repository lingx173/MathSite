/**
 * POST /api/practice
 *
 * - Uses PracticeRequest / PracticeResponse types.
 * - Validates all incoming fields (Zod); rejects invalid topic, count > 20.
 * - Defaults: domain="mathcounts", count=10, includeSolutions=true.
 * - Forwards validated payload to N8N_PRACTICE_WEBHOOK_URL (POST, JSON, 30s timeout).
 * - Returns n8n JSON unchanged on success.
 * - Structured errors: { error: "Practice generation failed", details } (400/502/503).
 * - Production safe: no secrets in responses, timeout and errors handled.
 */
import { NextRequest, NextResponse } from "next/server";
import type { PracticeRequest, PracticeResponse } from "@/lib/types/practice";
import { validatePracticeRequest } from "@/lib/validation/practice";
import { ZodError } from "zod";

const WEBHOOK_TIMEOUT_MS = 30_000;
const ERROR_MESSAGE = "Practice generation failed";

interface ErrorPayload {
  error: string;
  details?: string | Record<string, unknown>;
}

function errorResponse(
  status: number,
  details?: string | Record<string, unknown>
): NextResponse<ErrorPayload> {
  return NextResponse.json(
    { error: ERROR_MESSAGE, ...(details != null && { details }) },
    { status }
  );
}

export async function POST(request: NextRequest) {
  let payload: PracticeRequest;

  try {
    const raw = await request.json().catch(() => null);
    payload = validatePracticeRequest(raw);
  } catch (err) {
    if (err instanceof ZodError) {
      return errorResponse(400, err.flatten());
    }
    const message = err instanceof Error ? err.message : "Invalid request";
    return errorResponse(400, message);
  }

  const webhookUrl =
    process.env.N8N_PRACTICE_WEBHOOK_URL ||
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
  if (!webhookUrl || typeof webhookUrl !== "string" || webhookUrl.trim() === "") {
    return errorResponse(503, "Webhook is not configured");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text();
      let details: string | Record<string, unknown> = `n8n returned ${res.status}`;
      try {
        const json = JSON.parse(text) as Record<string, unknown>;
        if (Object.keys(json).length > 0) details = json;
      } catch {
        if (text) details = { status: res.status, body: text };
      }
      return errorResponse(502, details);
    }

    const data = await res.json();
    return NextResponse.json(data as PracticeResponse);
  } catch (err) {
    clearTimeout(timeoutId);
    const isAbort = err instanceof Error && err.name === "AbortError";
    const details =
      isAbort
        ? "Request timed out after 30 seconds"
        : err instanceof Error
          ? err.message
          : "Unknown error";
    return errorResponse(502, details);
  }
}

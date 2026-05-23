import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;

  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const error_description = searchParams.get("error_description");

  if (error) {
    const params = new URLSearchParams({ error, ...(error_description ? { error_description } : {}) });
    return Response.redirect(`${origin}/auth/error?${params}`);
  }

  if (!code) {
    return Response.redirect(`${origin}/auth/error?error=missing_code`);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    const params = new URLSearchParams({ error: exchangeError.message });
    return Response.redirect(`${origin}/auth/error?${params}`);
  }

  // Redirect to intended destination or default
  const redirectTo = next.startsWith("/") ? `${origin}${next}` : origin;
  return Response.redirect(redirectTo);
}

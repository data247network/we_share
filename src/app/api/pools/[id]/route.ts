import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pool, error } = await supabase
    .from("pools")
    .select(`
      *,
      item:items (
        *,
        shop:shops (*)
      ),
      members:pool_members (
        *,
        buyer:profiles (id, full_name, avatar_url)
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: error.code === "PGRST116" ? 404 : 500 });
  }

  return Response.json({ pool });
}

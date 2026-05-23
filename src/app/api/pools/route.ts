import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");

  let query = supabase
    .from("pools")
    .select(`
      *,
      item:items (
        *,
        shop:shops (*)
      )
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("item.category", category);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ pools: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { item_id, total_portions, price_per_portion_gbp, expires_at } = body;

  if (!item_id || !total_portions || !price_per_portion_gbp) {
    return Response.json({ error: "Missing required fields: item_id, total_portions, price_per_portion_gbp" }, { status: 400 });
  }

  // Verify the user owns a shop that has this item
  const { data: item, error: itemError } = await supabase
    .from("items")
    .select("*, shop:shops(*)")
    .eq("id", item_id)
    .single();

  if (itemError || !item) {
    return Response.json({ error: "Item not found" }, { status: 404 });
  }

  if (item.shop.owner_id !== user.id) {
    return Response.json({ error: "Forbidden: you do not own this shop" }, { status: 403 });
  }

  // Generate a pool reference
  const pool_ref = `WS-${Math.floor(1000 + Math.random() * 9000)}`;

  const { data: pool, error } = await supabase
    .from("pools")
    .insert({
      pool_ref,
      item_id,
      shop_id: item.shop_id,
      total_portions,
      filled_portions: 0,
      price_per_portion_gbp,
      status: "open",
      expires_at: expires_at ?? null,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ pool }, { status: 201 });
}

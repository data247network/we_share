import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const shop_id = searchParams.get("shop_id");
  const category = searchParams.get("category");
  const active = searchParams.get("active");

  let query = supabase
    .from("items")
    .select("*, shop:shops(id, name, slug, logo_url, verified)")
    .order("created_at", { ascending: false });

  if (shop_id) {
    query = query.eq("shop_id", shop_id);
  }

  if (category) {
    query = query.eq("category", category);
  }

  // Default to active items only unless explicitly set to false
  if (active !== "false") {
    query = query.eq("active", true);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ items: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    shop_id,
    name,
    description,
    category,
    image_urls,
    wholesale_price_gbp,
    retail_price_gbp,
    case_weight_g,
    split_options,
    default_split,
    min_fill_portions,
  } = body;

  if (!shop_id || !name || !category || !wholesale_price_gbp) {
    return Response.json({ error: "Missing required fields: shop_id, name, category, wholesale_price_gbp" }, { status: 400 });
  }

  // Verify the user owns this shop
  const { data: shop, error: shopError } = await supabase
    .from("shops")
    .select("id, owner_id")
    .eq("id", shop_id)
    .single();

  if (shopError || !shop) {
    return Response.json({ error: "Shop not found" }, { status: 404 });
  }

  if (shop.owner_id !== user.id) {
    return Response.json({ error: "Forbidden: you do not own this shop" }, { status: 403 });
  }

  const { data: item, error } = await supabase
    .from("items")
    .insert({
      shop_id,
      name,
      description: description ?? null,
      category,
      image_urls: image_urls ?? [],
      wholesale_price_gbp,
      retail_price_gbp: retail_price_gbp ?? null,
      case_weight_g: case_weight_g ?? null,
      split_options: split_options ?? [2, 4],
      default_split: default_split ?? 4,
      min_fill_portions: min_fill_portions ?? 1,
      active: true,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ item }, { status: 201 });
}

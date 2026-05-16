import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  const category = searchParams.get("category");
  const verified = searchParams.get("verified");
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  let query = supabase
    .from("shops")
    .select("*")
    .eq("active", true)
    .order("rating_avg", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.contains("categories", [category]);
  }

  if (verified === "true") {
    query = query.eq("verified", true);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ shops: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    name,
    slug,
    description,
    logo_url,
    categories,
    address,
    lat,
    lng,
  } = body;

  if (!name || !slug || !categories?.length) {
    return Response.json({ error: "Missing required fields: name, slug, categories" }, { status: 400 });
  }

  // Check if user already has a shop
  const { data: existingShop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  // Generate shop ref
  const shop_ref = `SH-${slug.toUpperCase().slice(0, 6)}-${Math.floor(100 + Math.random() * 900)}`;

  if (existingShop) {
    // Update existing shop
    const { data: shop, error } = await supabase
      .from("shops")
      .update({
        name,
        slug,
        description: description ?? null,
        logo_url: logo_url ?? null,
        categories,
        address: address ?? null,
        lat: lat ?? null,
        lng: lng ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existingShop.id)
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ shop });
  }

  // Create new shop
  const { data: shop, error } = await supabase
    .from("shops")
    .insert({
      owner_id: user.id,
      name,
      slug,
      description: description ?? null,
      logo_url: logo_url ?? null,
      categories,
      address: address ?? null,
      lat: lat ?? null,
      lng: lng ?? null,
      rating_avg: 0,
      rating_count: 0,
      verified: false,
      active: true,
      wholesale_price_verified: false,
      shop_ref,
    })
    .select()
    .single();

  if (error) {
    // Handle unique constraint violation on slug
    if (error.code === "23505") {
      return Response.json({ error: "A shop with this slug already exists" }, { status: 409 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ shop }, { status: 201 });
}

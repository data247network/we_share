-- WeShare NE England Demo Seed
-- Seller user UUID: c6f70b1d-bc67-4d08-8c14-00b3c5edbf79

-- ─── SHOPS ───────────────────────────────────────────────────────────────────

INSERT INTO public.shops (id, owner_id, name, slug, description, logo_url, categories, address, lat, lng, verified, active, shop_ref) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'c6f70b1d-bc67-4d08-8c14-00b3c5edbf79',
   'Tesco Metro Newcastle', 'tesco-metro-newcastle',
   'Your local Tesco Metro in the heart of Newcastle city centre. Wholesale portions of fresh meat, produce and drinks for the community.',
   'https://logo.clearbit.com/tesco.com',
   ARRAY['meat_poultry','drinks','pantry','produce'],
   'Grey Street, Newcastle upon Tyne, NE1 6EE', 54.9733, -1.6128, true, true, 'WS-SHOP-001'),

  ('a1b2c3d4-0002-0002-0002-000000000002', 'c6f70b1d-bc67-4d08-8c14-00b3c5edbf79',
   'Aldi Gateshead', 'aldi-gateshead',
   'Great quality at unbeatable prices. Aldi Gateshead wholesale deals on fresh meat, dairy and pantry essentials for Gateshead families.',
   'https://logo.clearbit.com/aldi.co.uk',
   ARRAY['meat_poultry','pantry','produce','frozen'],
   'MetroCentre Retail Park, Gateshead, NE11 9YG', 54.9581, -1.6734, true, true, 'WS-SHOP-002'),

  ('a1b2c3d4-0003-0003-0003-000000000003', 'c6f70b1d-bc67-4d08-8c14-00b3c5edbf79',
   'Lidl Sunderland', 'lidl-sunderland',
   'Lidl quality guaranteed. Split wholesale cases of fresh produce, meat and frozen goods with Sunderland neighbours.',
   'https://logo.clearbit.com/lidl.co.uk',
   ARRAY['meat_poultry','pantry','produce','frozen'],
   'Pallion Retail Park, Sunderland, SR4 6QF', 54.9003, -1.4027, true, true, 'WS-SHOP-003'),

  ('a1b2c3d4-0004-0004-0004-000000000004', 'c6f70b1d-bc67-4d08-8c14-00b3c5edbf79',
   'Morrisons Newcastle', 'morrisons-newcastle',
   'Morrisons makes it. Fresh from the farm to your door. Market Street butchery and deli at wholesale prices through WeShare pools.',
   'https://logo.clearbit.com/morrisons.com',
   ARRAY['meat_poultry','drinks','pantry','produce'],
   'Shields Road, Newcastle upon Tyne, NE6 1DQ', 54.9728, -1.5734, true, true, 'WS-SHOP-004'),

  ('a1b2c3d4-0005-0005-0005-000000000005', 'c6f70b1d-bc67-4d08-8c14-00b3c5edbf79',
   'Asda Byker', 'asda-byker',
   'ASDA Byker Rollback prices on bulk buys. Split wholesale cases of groceries and fresh meat with Byker and Walker neighbours.',
   'https://logo.clearbit.com/asda.com',
   ARRAY['meat_poultry','drinks','pantry','produce','frozen'],
   'Shields Road, Byker, Newcastle upon Tyne, NE6 1BX', 54.9739, -1.5649, true, true, 'WS-SHOP-005'),

  ('a1b2c3d4-0006-0006-0006-000000000006', 'c6f70b1d-bc67-4d08-8c14-00b3c5edbf79',
   'Hutchinson''s International Foods', 'hutchinsons-international',
   'Newcastle''s favourite international food store. Specialising in African, Caribbean and Asian wholesale goods — plantain, yam, jerk spices, dried fish and more.',
   'https://logo.clearbit.com/hutchinsons.co.uk',
   ARRAY['meat_poultry','pantry','produce','horeca'],
   'Grainger Market, Newcastle upon Tyne, NE1 5QQ', 54.9745, -1.6139, true, true, 'WS-SHOP-006')
ON CONFLICT (id) DO NOTHING;

-- ─── ITEMS ───────────────────────────────────────────────────────────────────

INSERT INTO public.items (id, shop_id, name, description, category, image_urls, wholesale_price_gbp, retail_price_gbp, case_weight_g, split_options, default_split) VALUES

  -- Tesco Metro Newcastle
  ('b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001',
   'British Ribeye Steak · 4 kg case', 'Prime British ribeye, dry-aged 21 days. Restaurant grade. Each quarter is approx 1 kg.',
   'meat_poultry', ARRAY['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'],
   7200, 10400, 4000, ARRAY[2,4], 4),

  ('b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001',
   'Scottish Salmon Fillet · 3 kg case', 'Fresh Scottish Atlantic salmon, skin-on fillets. Perfect for sharing with the family.',
   'meat_poultry', ARRAY['https://images.unsplash.com/photo-1510130387422-82bed34b37e9?w=600&q=80'],
   4800, 7200, 3000, ARRAY[2,4], 4),

  ('b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001',
   'Newcastle Brown Ale · 24-pack', 'The iconic Geordie brew. 24 x 500ml bottles at true trade price.',
   'drinks', ARRAY['https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&q=80'],
   2800, 3840, 12000, ARRAY[2,4], 4),

  -- Aldi Gateshead
  ('b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0002-0002-0002-000000000002',
   'Pork Shoulder · 5 kg case', 'Free-range British pork shoulder, bone-in. Ideal for slow-roasting. Each half is approx 2.5 kg.',
   'meat_poultry', ARRAY['https://images.unsplash.com/photo-1586901533048-0e856d9ac8d3?w=600&q=80'],
   2400, 3800, 5000, ARRAY[2,4], 4),

  ('b1b2c3d4-0005-0005-0005-000000000005', 'a1b2c3d4-0002-0002-0002-000000000002',
   'Northumberland Root Veg Box · 10 kg', 'Seasonal Northumberland veg — carrots, parsnips, swede, potatoes. Locally sourced.',
   'produce', ARRAY['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=600&q=80'],
   1400, 2400, 10000, ARRAY[2,4], 4),

  -- Lidl Sunderland
  ('b1b2c3d4-0006-0006-0006-000000000006', 'a1b2c3d4-0003-0003-0003-000000000003',
   'Free-Range Whole Chicken · 6-pack', 'British free-range whole chickens, average 1.6 kg each. 6 per case. Lidl Deluxe range.',
   'meat_poultry', ARRAY['https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=600&q=80'],
   3000, 4800, 9600, ARRAY[2,4,6], 4),

  ('b1b2c3d4-0007-0007-0007-000000000007', 'a1b2c3d4-0003-0003-0003-000000000003',
   'Wild Tiger Prawns · 2 kg bag', 'Wild-caught tiger prawns, shell-on. Ready for the barbie, stir-fry or curry night.',
   'frozen', ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'],
   1600, 2600, 2000, ARRAY[2], 2),

  -- Morrisons Newcastle
  ('b1b2c3d4-0008-0008-0008-000000000008', 'a1b2c3d4-0004-0004-0004-000000000004',
   'Hill Lamb Shoulder · 4 kg case', 'North of England hill lamb, slow-roast shoulder cuts. Halal certified.',
   'meat_poultry', ARRAY['https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&q=80'],
   5600, 8000, 4000, ARRAY[2,4], 4),

  ('b1b2c3d4-0009-0009-0009-000000000009', 'a1b2c3d4-0004-0004-0004-000000000004',
   'Wylam Brewery Craft Ales · 12-pack', 'Mixed craft ales from Newcastle''s award-winning Wylam Brewery. Dogma, Hawthorn, and more.',
   'drinks', ARRAY['https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=600&q=80'],
   2160, 3000, 6000, ARRAY[2,4], 4),

  -- Asda Byker
  ('b1b2c3d4-0010-0010-0010-000000000010', 'a1b2c3d4-0005-0005-0005-000000000005',
   'Chicken Thighs · 6 kg case', 'British chicken thighs, bone-in, skin-on. Perfect for big family meals and batch cooking.',
   'meat_poultry', ARRAY['https://images.unsplash.com/photo-1565299715199-866c917206bb?w=600&q=80'],
   2160, 3600, 6000, ARRAY[2,4,6], 4),

  ('b1b2c3d4-0011-0011-0011-000000000011', 'a1b2c3d4-0005-0005-0005-000000000005',
   'Basmati Rice · 10 kg sack', 'Extra long grain basmati, ideal for curry nights and large households. Rollback price.',
   'pantry', ARRAY['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80'],
   1400, 2200, 10000, ARRAY[2,4], 4),

  -- Hutchinson''s International Foods
  ('b1b2c3d4-0012-0012-0012-000000000012', 'a1b2c3d4-0006-0006-0006-000000000006',
   'Ripe Plantain · 10 kg case', 'Fresh ripe plantain imported from West Africa. Sweet, firm and ready to fry. Much cheaper than retail.',
   'produce', ARRAY['https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&q=80'],
   2000, 3200, 10000, ARRAY[2,4], 4),

  ('b1b2c3d4-0013-0013-0013-000000000013', 'a1b2c3d4-0006-0006-0006-000000000006',
   'Goat Meat (Bone-in) · 5 kg', 'Fresh goat cut into curry pieces. Halal-slaughtered, sourced from North England farms.',
   'meat_poultry', ARRAY['https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600&q=80'],
   5000, 7200, 5000, ARRAY[2,4], 4)

ON CONFLICT (id) DO NOTHING;

-- ─── POOLS ───────────────────────────────────────────────────────────────────
-- Weekend Flash Deals expire on Friday 2026-05-29 or Saturday 2026-05-30
-- Regular pools expire in coming days

INSERT INTO public.pools (id, pool_ref, item_id, shop_id, total_portions, filled_portions, price_per_portion_gbp, status, expires_at) VALUES

  -- Tesco pools (Fri/Sat flash deals)
  ('c1b2c3d4-0001-0001-0001-000000000001', 'WS-1001',
   'b1b2c3d4-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001',
   4, 2, 1800, 'open', '2026-05-29 20:00:00+01'),

  ('c1b2c3d4-0002-0002-0002-000000000002', 'WS-1002',
   'b1b2c3d4-0002-0002-0002-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001',
   4, 1, 1200, 'open', '2026-05-30 18:00:00+01'),

  ('c1b2c3d4-0003-0003-0003-000000000003', 'WS-1003',
   'b1b2c3d4-0003-0003-0003-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001',
   4, 3, 700, 'open', '2026-05-28 22:00:00+01'),

  -- Aldi pools
  ('c1b2c3d4-0004-0004-0004-000000000004', 'WS-1004',
   'b1b2c3d4-0004-0004-0004-000000000004', 'a1b2c3d4-0002-0002-0002-000000000002',
   4, 2, 600, 'open', '2026-05-30 18:00:00+01'),

  ('c1b2c3d4-0005-0005-0005-000000000005', 'WS-1005',
   'b1b2c3d4-0005-0005-0005-000000000005', 'a1b2c3d4-0002-0002-0002-000000000002',
   4, 1, 350, 'open', '2026-05-29 16:00:00+01'),

  -- Lidl pools
  ('c1b2c3d4-0006-0006-0006-000000000006', 'WS-1006',
   'b1b2c3d4-0006-0006-0006-000000000006', 'a1b2c3d4-0003-0003-0003-000000000003',
   4, 3, 750, 'open', '2026-05-30 20:00:00+01'),

  ('c1b2c3d4-0007-0007-0007-000000000007', 'WS-1007',
   'b1b2c3d4-0007-0007-0007-000000000007', 'a1b2c3d4-0003-0003-0003-000000000003',
   2, 1, 800, 'open', '2026-05-27 18:00:00+01'),

  -- Morrisons pools
  ('c1b2c3d4-0008-0008-0008-000000000008', 'WS-1008',
   'b1b2c3d4-0008-0008-0008-000000000008', 'a1b2c3d4-0004-0004-0004-000000000004',
   4, 1, 1400, 'open', '2026-05-30 16:00:00+01'),

  ('c1b2c3d4-0009-0009-0009-000000000009', 'WS-1009',
   'b1b2c3d4-0009-0009-0009-000000000009', 'a1b2c3d4-0004-0004-0004-000000000004',
   4, 2, 540, 'open', '2026-05-29 22:00:00+01'),

  -- Asda pools
  ('c1b2c3d4-0010-0010-0010-000000000010', 'WS-1010',
   'b1b2c3d4-0010-0010-0010-000000000010', 'a1b2c3d4-0005-0005-0005-000000000005',
   4, 2, 540, 'open', '2026-05-30 14:00:00+01'),

  ('c1b2c3d4-0011-0011-0011-000000000011', 'WS-1011',
   'b1b2c3d4-0011-0011-0011-000000000011', 'a1b2c3d4-0005-0005-0005-000000000005',
   4, 3, 350, 'open', '2026-05-29 20:00:00+01'),

  -- Hutchinson''s pools
  ('c1b2c3d4-0012-0012-0012-000000000012', 'WS-1012',
   'b1b2c3d4-0012-0012-0012-000000000012', 'a1b2c3d4-0006-0006-0006-000000000006',
   4, 2, 500, 'open', '2026-05-30 18:00:00+01'),

  ('c1b2c3d4-0013-0013-0013-000000000013', 'WS-1013',
   'b1b2c3d4-0013-0013-0013-000000000013', 'a1b2c3d4-0006-0006-0006-000000000006',
   4, 1, 1250, 'open', '2026-05-29 20:00:00+01')

ON CONFLICT (id) DO NOTHING;

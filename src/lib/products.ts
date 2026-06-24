import { supabase } from "@/integrations/supabase/client";
import {
  assetImageRef,
  catalogAssetMap,
  catalogProducts,
} from "@/data/catalog-products";
import { portfolioAssetMap } from "@/data/portfolio-assets";

export type Category = {
  id: string;
  slug: string;
  name: string;
  mega_column: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  tech_info: string | null;
  images: string[];
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const imageUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  if (path.startsWith("asset:")) {
    const key = path.slice("asset:".length);
    return catalogAssetMap[key] ?? portfolioAssetMap[key] ?? "";
  }
  return supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
};

export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as Category[];
};

export const fetchProductsByCategory = async (categorySlug: string) => {
  const { data: cat } = await supabase
    .from("categories")
    .select("id, name, slug, mega_column")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (!cat) return { category: null, products: [] as Product[] };
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", cat.id)
    .eq("active", true)
    .order("sort_order");
  return { category: cat, products: ((data ?? []) as any[]).map(normalizeProduct) };
};

export const fetchAllProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return ((data ?? []) as any[]).map(normalizeProduct);
};

export const fetchActiveProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return ((data ?? []) as any[]).map(normalizeProduct);
};

export const importCatalogProducts = async (): Promise<{ inserted: number; skipped: number }> => {
  const categories = await fetchCategories();
  const slugToId = new Map(categories.map((c) => [c.slug, c.id]));

  const { data: existing } = await supabase.from("products").select("slug");
  const existingSlugs = new Set((existing ?? []).map((p) => p.slug));

  let inserted = 0;
  let skipped = 0;

  for (const item of catalogProducts) {
    if (existingSlugs.has(item.slug)) {
      skipped += 1;
      continue;
    }

    const category_id = slugToId.get(item.categorySlug) ?? null;
    const { error } = await supabase.from("products").insert({
      name: item.name,
      slug: item.slug,
      description: item.description,
      category_id,
      images: [assetImageRef(item.imageKey)],
      sort_order: item.sort_order,
      active: true,
    });

    if (error) throw error;
    inserted += 1;
    existingSlugs.add(item.slug);
  }

  return { inserted, skipped };
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  return data ? normalizeProduct(data) : null;
};

const normalizeProduct = (row: any): Product => ({
  ...row,
  images: Array.isArray(row.images) ? row.images : [],
});

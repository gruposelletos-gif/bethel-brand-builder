import { supabase } from "@/integrations/supabase/client";

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
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as any[]).map(normalizeProduct);
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const { data } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  return data ? normalizeProduct(data) : null;
};

const normalizeProduct = (row: any): Product => ({
  ...row,
  images: Array.isArray(row.images) ? row.images : [],
});

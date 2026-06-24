import { supabase } from "@/integrations/supabase/client";
import { imageUrl, slugify } from "@/lib/products";

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  images: string[];
  cover_index: number;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const portfolioCoverUrl = (project: Pick<PortfolioProject, "images" | "cover_index">) => {
  const path = project.images[project.cover_index] ?? project.images[0];
  return path ? imageUrl(path) : "";
};

export const portfolioImageUrls = (images: string[]) => images.map((path) => imageUrl(path));

export const fetchPortfolioProjects = async (activeOnly = false): Promise<PortfolioProject[]> => {
  let query = supabase
    .from("portfolio_projects")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });

  if (activeOnly) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).map((row) => ({
    ...row,
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
  }));
};

export const uploadPortfolioImage = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `portfolio/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) throw error;
  return path;
};

export const deletePortfolioStorageImage = async (path: string) => {
  if (path.startsWith("http") || path.startsWith("asset:")) return;
  await supabase.storage.from("product-images").remove([path]);
};

export const buildPortfolioSlug = (title: string) => slugify(title);

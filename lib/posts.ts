import { getMockStore } from "@/lib/mockStore";

export type Post = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  coverImage?: string;
  publishedAt?: string;
  content: string;
};

export const getPosts = async () => {
  return getMockStore().posts as Post[];
};

export const getPostBySlug = async (slug: string) => {
  const normalized = decodeURIComponent(slug).trim().toLowerCase();
  return (
    (await getPosts()).find(
      (item) => item.slug.trim().toLowerCase() === normalized
    ) || null
  );
};

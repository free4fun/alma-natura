import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import Paginator from "@/components/Paginator";
import { getPosts } from "@/lib/posts";
import NotesListClient from "@/components/NotesListClient";

export const metadata = {
  title: "Notas | Alma Natura",
};

export default async function NotesPage() {
  const posts = (await getPosts())
    .filter((post) => post.status === "publicado")
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));

  return <NotesListClient posts={posts} />;
// ...no cerrar nada aquí, el export default ya cierra la función
}

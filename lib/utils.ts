import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getMarkdown({ slug, lang, getMd }: { slug: string; lang: string, getMd: boolean }) {
  return await fetch(`https://n8n.francesco-bruno.com/webhook/getMarkdown?title=${slug}&lang=${lang}&getMd=${getMd}`)
    .then((res) => res.json())
    .then((data) => data);
}


import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getMarkdown({ slug, lang, getMd }: { slug: string; lang: string, getMd: boolean }) {
  const res = await fetch(`https://n8n.francesco-bruno.com/webhook/getMarkdown?title=${slug}&lang=${lang}&getMd=${getMd}`);
  if (!res.ok) {
    return null;
  }
  try {
    return await res.json();
  } catch (_err) {
    return null;
  }
}


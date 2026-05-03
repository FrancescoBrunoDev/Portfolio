import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── kDrive API client ───────────────────────────────────────────

const KDRIVE_API_TOKEN = process.env.KDRIVE_API_TOKEN
const KDRIVE_DRIVE_ID = process.env.KDRIVE_DRIVE_ID
const BLOG_ROOT_DIR_ID = process.env.BLOG_ROOT_DIR_ID
const KDRIVE_API_BASE = "https://api.infomaniak.com"

/**
 * Make an authenticated request to the Infomaniak kDrive API.
 * Uses Next.js fetch cache (revalidated every hour) for GET requests.
 */
async function kdriveRequest<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  if (!KDRIVE_API_TOKEN) {
    throw new Error("KDRIVE_API_TOKEN environment variable is not set")
  }

  const url = `${KDRIVE_API_BASE}${endpoint}`
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${KDRIVE_API_TOKEN}`,
      ...init?.headers,
    },
    // Cache GET metadata requests for 1 hour (ISR-compatible)
    next: { revalidate: 3600 },
  })

  if (!res.ok) {
    throw new Error(`kDrive API HTTP ${res.status}: ${res.statusText}`)
  }

  const json = await res.json()
  if (json.result === "error") {
    throw new Error(json.error?.message ?? "kDrive API returned an error")
  }

  return json.data as T
}

/** A file or directory item returned by the kDrive API. */
interface KDriveItem {
  id: number
  name: string
  type: "file" | "dir"
  size: number
}

/** List items inside a directory. */
async function listDirectory(dirId: string | number): Promise<KDriveItem[]> {
  return kdriveRequest<KDriveItem[]>(
    `/3/drive/${KDRIVE_DRIVE_ID}/files/${dirId}/files`,
  )
}

/** Download a file's raw content as text. */
async function downloadFile(fileId: number): Promise<string> {
  const url = `${KDRIVE_API_BASE}/2/drive/${KDRIVE_DRIVE_ID}/files/${fileId}/download`
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${KDRIVE_API_TOKEN}` },
    redirect: "follow",
  })

  if (!res.ok) {
    throw new Error(`File download failed: HTTP ${res.status}`)
  }

  return res.text()
}

// ─── Public API ──────────────────────────────────────────────────

export interface MarkdownData {
  md?: string
  title?: string
  lang?: string[]
}

export type MarkdownResult = {
  result?: string
  results?: string
  data?: MarkdownData
} | null

/**
 * Fetch markdown content or metadata for a blog post directly from kDrive.
 *
 * Replaces the previous n8n webhook (`getMarkdown`) with direct kDrive API calls.
 *
 * @param slug  - The blog post slug (matches the kDrive directory name).
 * @param lang  - 2-letter language code (e.g. "en", "it").
 * @param getMd - If `true`, downloads and returns the raw markdown content.
 *                If `false`, returns only metadata (title + available languages).
 */
export async function getMarkdown({
  slug,
  lang,
  getMd,
}: {
  slug: string
  lang: string
  getMd: boolean
}): Promise<MarkdownResult> {
  if (!KDRIVE_DRIVE_ID || !BLOG_ROOT_DIR_ID) {
    throw new Error("KDRIVE_DRIVE_ID and BLOG_ROOT_DIR_ID environment variables are required")
  }

  try {
    // 1. List all blog post directories under the root
    const blogItems = await listDirectory(BLOG_ROOT_DIR_ID)

    // 2. Find the directory whose name matches the requested slug
    const blogDir = blogItems.find(
      (item) => item.name === slug && item.type === "dir",
    )

    if (!blogDir) {
      return { results: "no md in this lang" }
    }

    // 3. List files inside the blog post directory
    const files = await listDirectory(blogDir.id)

    // 4. Collect all available language codes (first 2 chars of each .md filename)
    const mdFiles = files.filter(
      (f): f is KDriveItem & { type: "file" } =>
        f.type === "file" && f.name.endsWith(".md"),
    )
    const allLangs = [...new Set(mdFiles.map((f) => f.name.slice(0, 2)))]

    // 5. Find the file matching the requested language.
    //    Naming convention: "{lang}-{title}.md" (e.g. "en-My Post.md")
    //    The original n8n workflow checks if filename (without .md) *contains* the lang.
    const matchingFile = mdFiles.find((f) =>
      f.name.replace(/\.md$/, "").includes(lang),
    )

    if (!matchingFile) {
      return { result: "file not found" }
    }

    // 6. Extract the human-readable title: strip lang prefix + separator (3 chars) and .md extension
    const title = matchingFile.name.slice(3).replace(/\.[^.]+$/, "")

    if (getMd) {
      // 7a. Download and return the actual markdown content
      const content = await downloadFile(matchingFile.id)
      return {
        result: "success",
        data: { md: content, title, lang: allLangs },
      }
    }

    // 7b. Return metadata only (title + available languages)
    return {
      result: "success",
      data: { title, lang: allLangs },
    }
  } catch (_err) {
    return null
  }
}

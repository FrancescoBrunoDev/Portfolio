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
/**
 * Batch-fetch metadata for ALL blog posts in a single pass.
 *
 * Instead of calling `getMarkdown` N times (2N API calls),
 * this lists the blog root once and then lists each post directory once,
 * returning a slug -> metadata map.
 */
export async function getAllBlogMetadata(): Promise<Map<string, { title: string; lang: string[] }>> {
  if (!KDRIVE_DRIVE_ID || !BLOG_ROOT_DIR_ID) {
    throw new Error("KDRIVE_DRIVE_ID and BLOG_ROOT_DIR_ID environment variables are required")
  }

  const blogItems = await listDirectory(BLOG_ROOT_DIR_ID)
  const postDirs = blogItems.filter((item) => item.type === "dir")

  // List files inside each post directory in parallel
  const dirFileLists = await Promise.all(
    postDirs.map(async (dir) => {
      const files = await listDirectory(dir.id)
      return { slug: dir.name, files }
    }),
  )

  const metadataMap = new Map<string, { title: string; lang: string[] }>()

  for (const { slug, files } of dirFileLists) {
    const mdFiles = files.filter(
      (f): f is KDriveItem & { type: "file" } =>
        f.type === "file" && f.name.endsWith(".md"),
    )
    const allLangs = [...new Set(mdFiles.map((f) => f.name.slice(0, 2)))]

    // Use the first available file to extract the title (strip lang prefix + extension)
    const title = mdFiles[0]?.name.slice(3).replace(/\.[^.]+$/, "") ?? slug

    metadataMap.set(slug, { title, lang: allLangs })
  }

  return metadataMap
}

/**
 * Strip Obsidian vault metadata that may be injected at the top of exported .md files.
 *
 * Handles two formats:
 * 1. Plain text metadata lines at the top of the file
 * 2. YAML frontmatter blocks (--- delimited) containing Obsidian metadata
 *
 * Obsidian metadata keys: source_url, ingested, sha256
 *
 * Only strips from the leading block so we don't accidentally remove legitimate content
 * that happens to contain those strings later in the document.
 */
function stripObsidianMetadata(md: string): string {
  const metadataKeys = ["source_url", "ingested", "sha256"]
  const lines = md.split(/\n/)

  // First pass: try stripping plain-text metadata lines from the top
  let cleanIndex = 0
  while (cleanIndex < lines.length) {
    const line = lines[cleanIndex]
    const trimmed = line.trim()

    if (
      trimmed === "" ||
      trimmed.startsWith("#") ||
      trimmed.startsWith("---")
    ) {
      break
    }

    const isMetadata = metadataKeys.some((key) =>
      trimmed.startsWith(`${key}:`),
    )

    if (!isMetadata) {
      break
    }

    cleanIndex++
  }

  if (cleanIndex > 0) {
    const remaining = lines.slice(cleanIndex)
    if (remaining.length > 0 && remaining[0].trim() === "") {
      return remaining.slice(1).join("\n")
    }
    return remaining.join("\n")
  }

  // Second pass: check for YAML frontmatter block containing Obsidian metadata
  if (lines[0]?.trim() === "---") {
    let closingIndex = 1
    while (closingIndex < lines.length) {
      if (lines[closingIndex].trim() === "---") {
        break
      }
      closingIndex++
    }

    if (closingIndex < lines.length) {
      const frontmatterContent = lines.slice(1, closingIndex).join("\n")
      const hasObsidianMetadata = metadataKeys.some((key) =>
        frontmatterContent.includes(`${key}:`),
      )

      if (hasObsidianMetadata) {
        const afterFrontmatter = lines.slice(closingIndex + 1)
        if (afterFrontmatter.length > 0 && afterFrontmatter[0].trim() === "") {
          return afterFrontmatter.slice(1).join("\n")
        }
        return afterFrontmatter.join("\n")
      }
    }
  }

  return md
}

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
      const cleaned = stripObsidianMetadata(content)
      return {
        result: "success",
        data: { md: cleaned, title, lang: allLangs },
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

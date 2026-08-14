# Portfolio — Code & Configuration Audit

Full-repo review. `yarn build` and `yarn lint` both pass; `yarn audit` reports 0 vulnerabilities.

Status legend: ✅ fixed · ⏸️ assessed/kept (intentional) · ➖ removed as dead code

---

## 🔴 Security & secrets

### 1. ✅ PocketBase admin credentials used from a public server action
`actions/actionsStava.ts` authenticated as the PocketBase **superuser** from a `"use server"` action and called the Strava API on demand. The whole Strava feature was dead (the UI was commented out), so it was **deleted** — `actions/actionsStava.ts` and `components/strava/stravaInfo.tsx` are gone.

### 2. ✅ Strava client secret in the URL
Removed with the Strava feature (#1).

### 3. ✅ Hardcoded record IDs
Removed with the Strava feature (#1).

### 4. ✅ `.env` with live credentials in the repo root
`.env` remains gitignored (verified not in history). Added `.env.example` with placeholder values; real secrets should live in the deployment platform.

### 5. ✅ Raw HTML injection from remote data
- `components/books/modalInfoBook.tsx` now sanitizes SVG notes with `isomorphic-dompurify` before `dangerouslySetInnerHTML`.
- `app/section/projects/[id]/page.tsx` now sanitizes `project.description` with `DOMPurify.sanitize()` before `html-react-parser`.

### 6. ✅ Unescaped slug interpolation in PocketBase filters
Both `getFirstListItem` calls in the blog post route now use `pb.filter("slug = {:slug}", { slug })`.

---

## 🟠 Correctness bugs

### 7. ✅ Prev/next navigation labels swapped
`components/projects/project/frame.tsx`: left link now goes to `prev` (labeled "prev"), right link goes to `next` (labeled "next").

### 8. ✅ Language matching was substring-based
`lib/utils.ts` `getMarkdown()` now matches files with `f.name.startsWith(lang + "-")`; `getAllBlogMetadata()` uses the same prefix extraction (`langPrefix()`), so the two agree.

### 9. ✅ About & Home pages baked PocketBase data in at build time
`app/section/about/page.tsx` now has `export const revalidate = 3600`. `/` already revalidates hourly via the kDrive fetch cache.

### 10. ✅ Docker build missing kDrive env vars
`Dockerfile` and `docker-compose.yml` now pass `KDRIVE_DRIVE_ID` and `BLOG_ROOT_DIR_ID` as build args.

### 11. ✅ `fetchBooks()` return type and error handling were wrong
`fetchBooks()` now returns `Book.Year[] | { error: string }`, groups by year in a `Map`, and `BooksView`/`SearchBox` operate on an array instead of `Object.values()` of an object.

### 12. ✅ Book modal typos and broken classes
Fixed `max-h-36text-2xl` → `max-h-36 text-2xl`, `stroke-secondar` → `stroke-secondary` (×2), and `Object.keys(note).length` → `note.length`.

### 13. ➖ Dead `textmorphing.tsx` imported a Node builtin and leaked listeners
Deleted the file.

### 14. ➖ Strava cleanup logic broken
Removed with the Strava feature (#1).

### 15. ✅ Reference registration was fragile
`lib/ReferenceContext.tsx` now uses a stable `useCallback` + `useState`; the `setTimeout(0)` workaround and `useMemo`-on-`references` churn are gone.

### 16. ✅ Date formatting on empty strings
`timelinePrimary.tsx` and `timelineSecondary.tsx` now guard before constructing `new Date(end_date)`.

---

## 🟡 Performance

### 17. ✅ Blog post page did redundant kDrive calls
`app/section/record/[lang]/blog/[slug]/page.tsx` derives `availableLanguages` from the single `getMarkdown()` result instead of one `getMarkdown()` call per language; the fallback uses `getAllBlogMetadata()` once.

### 18. ✅ No caching layer for kDrive metadata
`getMarkdown()` and `getAllBlogMetadata()` are wrapped in React `cache()` (per-request dedupe), and `downloadFile()` now sets `next: { revalidate: 3600 }`.

### 19. ✅ 182 DOM icons for a background
`components/books/backgroundDots.tsx` now renders a single CSS radial-gradient dot pattern.

### 20. ⏸️ Full-screen backdrop-blur on the landing
Assessed and kept: the blur is required for text readability over the animated SVG. Revisit only if profiling shows it is a bottleneck on low-end devices.

---

## 🟡 Dependencies / build / config

### 21. ✅ `yarn lint` was broken
Added `eslint.config.mjs` (flat config from `eslint-config-next`), pinned `eslint@^9.39.5` (ESLint 10 is incompatible with the shipped `eslint-plugin-react`), and changed the script to `eslint .`. `yarn lint` now passes.

### 22. ✅ System packages installed from an npm script
Removed the `sudo apt-get` script; the GraphicsMagick requirement is documented in `README.md` and `lib/syncSvg.ts`.

### 23. ✅ Machine-specific `.npmrc`
Deleted.

### 24. ✅ Hardcoded IP in `next.config.js`
`allowedDevOrigins` now reads `ALLOWED_DEV_ORIGINS` (comma-separated) and defaults to `[]`.

### 25. ✅ Production PocketBase URL hardcoded for images
`images.remotePatterns` is now derived from `POCKETBASE_URL`.

### 26. ✅ Stale `components.json`
Removed the nonexistent `tailwind.config.ts` reference.

### 27. ✅ Dependabot only watched devcontainers
Added a `npm` update entry.

### 28. ✅ Fragile `resolutions`
Removed the `*/brace-expansion: >=5.0.9` chains (they forced `brace-expansion@5` under `minimatch@3` and broke ESLint's `braceExpand`). The remaining resolutions are minimal safe-version floors (`phin`, `follow-redirects`, `postcss`, `shell-quote`, `sharp`, `@babel/core`, `nanoid`). `yarn audit` = 0 vulnerabilities.

### 29. ✅ Bleeding-edge pins
Fixed `@types/react`/`@types/react-dom` from `npm:types-react@19.0.0-rc.1` to stable `@types/react@19.2.18` / `@types/react-dom@19.2.4`. ⏸️ `typescript@6.0.2` and `lucide-react@1.8.0` left as-is — they install and build cleanly; downgrading adds risk with no current benefit.

### 30. ⏸️ `patch-package` for `next-mdx-remote`
Assessed and kept: the patch is a 1-file React-19 import fix and `yarn install`/`yarn build` work. Replacing the MDX pipeline (`next-mdx-remote-client` / `@next/mdx`) is a larger change and can be done separately if the patch ever breaks.

### 31. ✅ `tsconfig` target `es5`
Changed to `es2017`.

### 32. ✅ `npm-run-all` for one script
Removed the dependency; `dev` is now `next dev`.

### 33. ✅ Runtime deps that are build-tool deps
Moved `potrace`, `pdf2pic`, `page-count`, `fs-extra`, and `dotenv` to `devDependencies`.

---

## 🟡 Dead code / cleanup

### 34. ✅ Unused shadcn/ui components
Deleted `checkbox`, `label`, `popover`, `radio-group`, `select` and their now-unused `@radix-ui/react-*` deps (plus `@types/react-window`).

### 35. ➖ Unused `textmorphing.tsx`
Deleted (#13).

### 36. ➖ Strava code effectively dead
Deleted (#1).

### 37. ✅ Duplicated project queries
`app/section/projects/page.tsx` now reuses `getProjects()` from `lib/projects.ts`.

### 38. ✅ `getMacroType` was a server action
Moved the whole `actions/actionsProjects.ts` module to `lib/projects.ts` as plain functions (none of them were called from the client). The now-empty `actions/` directory was removed.

### 39. ✅ `const book: any` in the intercepting modal
Both book routes now narrow `fetchBook()`'s result with a typed cast and `Array.isArray()` for the note field.

### 40. ✅ Misleading font variable
`outfit` (which loaded Rubik) renamed to `mainFont`.

### 41. ✅ Messy `public/` assets
Deleted unused `favicon_io/`, `icona.svg`, `icona logo.svg`, `logo.png`, and `nnnoise.svg`.

### 42. ✅ Typos / mixed-language identifiers
Fixed `SpecialContetent` → `SpecialContent`, `bibliograpghy.tsx` → `bibliography.tsx`, `stringBibliograpy` → `stringBibliography`, `timelineSecondaty.tsx` → `timelineSecondary.tsx`, `lenghtMainTitle` → `lengthMainTitle`, `stroke-secondar` → `stroke-secondary`, `Münster` encoding, and removed the unused typo'd `tranlatedNotes` type field.

### 43. ✅ Stray JSX semicolon
Removed from `app/section/record/books/page.tsx`.

---

## 🟡 Accessibility / UX

### 44. ✅ Book modal was not a real modal
The intercepting overlay now has `role="dialog"`, `aria-modal="true"`, and an `aria-label`; `ModalInfoBook` closes on Escape when `isClosable`.

### 45. ✅ Background video autoplay
Added `playsInline` to the project background video.

### 46. ✅ Motion templates ignored reduced motion
Replaced the four near-identical framer-motion templates with a single `components/pageTransition.tsx` that respects `useReducedMotion()`.

### 47. ✅ Brittle path parsing
`LanguageSwitcher` now derives `lang` from `useParams()`; the blog layout's post-detection check was clarified.

---

## 🟡 Type safety

### 48. ✅ Global types didn't match PocketBase reality
`types/globals.d.ts`: ids are `string`, ISBNs are `string`, `Book.Year.bookDetails` is `Book.Book[]` (the previous `BookDetails[]` name didn't even exist — hidden by `skipLibCheck`), `Note` is `{ svg: string }`, and the unused/typo'd `Book` fields were removed.

---

## Deferred / intentional (not changed)

- **#20** full-screen `backdrop-blur-2xl` — kept for readability; revisit only if profiled.
- **#29** `typescript@6.0.2` + `lucide-react@1.8.0` — kept (build cleanly).
- **#30** `next-mdx-remote` patch — kept (works); replace pipeline only if it breaks.
- **#28** remaining `resolutions` — kept as minimal safe floors (audit is clean).

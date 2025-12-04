# AGENTS.md

## Build & Dev Commands

- `yarn dev` - Start development server
- `yarn build` - Production build
- `yarn lint` - Run ESLint via Next.js
- No test framework configured

## Tech Stack

Next.js 16 (App Router), React 19, TypeScript 5.9, Tailwind CSS 4, shadcn/ui, Framer Motion, PocketBase

## Code Style

- **Imports**: Use `@/*` path alias. Order: React/Next → third-party → `@/components` → `@/lib` → `@/actions` → types
- **Components**: PascalCase names, Server Components by default, add `"use client"` only when needed
- **Files**: camelCase (e.g., `fetchBooks.tsx`), types in `types/` dir
- **Formatting**: Prettier with `prettier-plugin-tailwindcss` for class sorting
- **TypeScript**: Strict mode enabled, inline prop types preferred, use optional chaining

## Error Handling

- Try-catch with console logging, return null/empty on failure
- Prefix unused error vars with underscore (`_err`)
- Use `error.tsx` for route-level error boundaries

## Conventions

- Server actions use `"use server"` directive in separate files under `actions/`
- UI components follow shadcn/ui patterns with `forwardRef`
- Context providers paired with custom `use*` hooks in `lib/`

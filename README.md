# Portfolio

Personal website of Francesco Bruno, built with Next.js (App Router), Tailwind CSS 4, Framer Motion, and PocketBase.

## Requirements

- Node.js (see `.nvmrc` / Docker image) + Yarn 1
- A PocketBase instance with the collections used by the site (`articles`, `projects`, `occupations`, `education`, `books`, `book_info`, `book_note`, …)
- A kDrive (Infomaniak) account for blog markdown, configured via env vars

## Setup

```bash
cp .env.example .env   # then fill in real values
yarn install
yarn dev
```

## Commands

- `yarn dev` — start the development server
- `yarn build` — production build
- `yarn start` — serve the production build
- `yarn lint` — ESLint

## Book notes SVG sync

`yarn syncSvg` regenerates book-note SVGs from PDFs stored in PocketBase. It requires `graphicsmagick` (and `unzip`/`curl`) installed on the host, e.g. `sudo apt-get install -y unzip curl graphicsmagick`.

## Docker

```bash
docker compose up --build
```
Build args are taken from `.env` (see `docker-compose.yml`).

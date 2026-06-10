# Hu Haotian Portfolio

Private source repository for Hu Haotian's engineering research portfolio.

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
```

## GitHub Pages Build

This repository includes a GitHub Actions workflow that exports the site as static files for GitHub Pages.

```bash
NEXT_PUBLIC_BASE_PATH=/hutian-portfolio npm run build:static
```

The repository can remain private. The published portfolio page is intended to be publicly viewable.

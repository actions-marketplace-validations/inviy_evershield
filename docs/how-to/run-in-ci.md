# Run evershield in CI

## Fastest path

Run this in your project root:

```bash
npx evershield init
```

It detects the framework (Next.js, Vite, Astro, SvelteKit, Nuxt, CRA), the
build directory and package manager, and writes `evershield.config.json` and
`.github/workflows/evershield.yml`. Existing files are left alone unless you
pass `--force`.

## Write the workflow yourself

The GitHub Action scans your build and uploads the result to the Security
tab as code-scanning alerts:

```yaml
# .github/workflows/evershield.yml
name: evershield
on: [pull_request, push]
permissions:
  contents: read
  security-events: write   # for the SARIF upload
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci && npm run build      # produce dist/ or .next/
      - uses: inviy/evershield@v0
        with:
          path: ./dist
```

The step fails when evershield exits 1 (blocking findings) or 2 (error),
after the SARIF upload. All inputs are listed in the
[Action reference](../reference/cli.md#github-action).

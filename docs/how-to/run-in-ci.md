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

## Also audit API responses in CI

The Action runs layer 1 (`scan`) by default. Set `command: audit` to run
layer 2 against a deployed preview or staging API, with the tokens from
repository secrets:

```yaml
      - uses: inviy/evershield@v0
        with:
          command: audit
        env:
          EVERSHIELD_FREE_TOKEN: ${{ secrets.EVERSHIELD_FREE_TOKEN }}
          EVERSHIELD_PRO_TOKEN: ${{ secrets.EVERSHIELD_PRO_TOKEN }}
```

The `audit` section of `evershield.config.json` decides which URL is called
(see [Audit API responses](audit-api-responses.md)). Its results are
uploaded under their own code-scanning category, `evershield-audit`.

Layer 3 (`surface`) is not available in the Action yet: it needs Playwright
and a browser on the runner. Run it as a plain step instead:

```yaml
      - run: npm install --save-dev playwright && npx playwright install --with-deps chromium
      - run: npx evershield surface
        env:
          EVERSHIELD_FREE_STATE: free.json
          EVERSHIELD_PRO_STATE: pro.json
```

## Exit codes

The Action step fails when evershield exits 1 (blocking findings) or 2 (error),
after the SARIF upload. All inputs are listed in the
[Action reference](../reference/cli.md#github-action).

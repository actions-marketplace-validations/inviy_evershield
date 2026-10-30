# Scan a build or app package

Layer 1. Use this to check what the shipped files give away: keys, internal
URLs, source maps.

```bash
# a built artifact directory
npx evershield scan ./dist            # Vite, CRA, Astro, static sites, …
npx evershield scan ./.next           # Next.js: only browser-facing files are scanned

# mobile and desktop app packages: everything inside ships to the device
npx evershield scan app-release.apk   # Android (.apk, .aab), incl. Hermes bytecode and DEX strings
npx evershield scan MyApp.ipa         # iOS: main.jsbundle and the app executable's strings
npx evershield scan app.asar          # Electron
npx evershield scan ./dist            # an Expo / React Native export (*.hbc, *.bundle)
```

## Change the output or the gate

```bash
# machine-readable output and a stricter gate for CI
npx evershield scan ./dist --format json --fail-on medium --min-confidence low

# SARIF for code scanning, written to a file
npx evershield scan ./dist --format sarif --output evershield.sarif
```

Matched values are never printed in full.

Layer 1 overlaps with secret scanners such as gitleaks, which can also scan
a build directory; run both. What evershield adds is build-aware filtering
and the same report, gate and SARIF output as the other two layers.

See also: [artifact rules](../rules.md#layer-1-artifact),
[CLI reference](../reference/cli.md).

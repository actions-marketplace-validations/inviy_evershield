# Your first evershield run

This walks you from nothing to a passing check on your own project. You will
see a finding, read it, and make it go away. Plan on about ten minutes.

You need Node.js and a web project that builds to a directory (`dist/`,
`.next/`, ...).

## 1. See what a finding looks like

```bash
npx evershield demo
```

This runs all three layers on a built-in app whose paywall only blurs. Each
line reads `[severity/confidence] what, where`. A `✖` means the line would
fail a build; a `•` means it would not.

Now run the fixed version and notice it reports nothing:

```bash
npx evershield demo --fixed
```

## 2. Add evershield to your project

In your project root:

```bash
npx evershield init
```

It detects your framework and build directory and writes
`evershield.config.json` and `.github/workflows/evershield.yml`. Nothing
existing is overwritten.

## 3. Scan your build

Build as you normally do, then scan the output:

```bash
npm run build
npx evershield scan ./dist        # use ./.next for Next.js
```

Check the exit code:

```bash
echo $?
```

`0` means nothing blocking. `1` means at least one `✖` line.

## 4. Deal with a finding

For each `✖` line, do one of two things:

- **It is a real leak.** Fix it at the source (move the key server-side, turn
  off production source maps, ...), rebuild and scan again.
- **It is known to be safe.** Add an ignore entry with a reason, as shown in
  [Allowlist a finding](how-to/allowlist-a-finding.md). evershield refuses
  an ignore without a reason.

Repeat until the scan exits `0`.

## 5. Check what each plan receives

The build scan only sees shipped files. The leak evershield was built for is
a free user receiving Pro data at runtime. If your app has plans, go on to
[Audit what each plan receives from your API](how-to/audit-api-responses.md).

## What you did

You ran the demo, set up a config and workflow, scanned your own build and
got it to exit `0`. The workflow from step 2 now runs that scan on every pull
request.

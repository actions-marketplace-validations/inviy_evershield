# Check what reverse engineers get

Use this to see a build from the attacker's side. Tools like
[REA](https://github.com/morluto/rea) cannot be blocked: they run in the
attacker's own browser, on their own copy of your app. What you control is
what they get. `recon` fails the build while anything is worth taking.

```bash
npx evershield recon ./dist               # or an .apk, .ipa, .asar
npx evershield recon ./dist --rea         # also run REA itself and check each finding against its output
```

```
Worth taking: 2 blocking, 3 total
✖ [critical/high] Stripe secret key shipped in assets/index.js  · REA: recovered
✖ [high/high] Source map shipped: assets/index.js.map  · REA: not checked
• [medium/medium] Private IP address in assets/index.js: 10.0.3.7  · REA: recovered

Map (informational: any tool reconstructs this from shipped code; keep server-side checks on it)
  hosts: api.example.com (12)
  API paths: /api/report, /api/user
  source maps: 1 file(s), 2 original source(s), 2 with full content

Verdict: 2 item(s) worth taking. Anyone running a reverse-engineering tool on this target gets them.
```

The map is what no build can hide (routes, hosts, field names); use it to
list the endpoints that need server-side authorization. With `--rea`, values
are compared in memory and never printed.

Pair it with [audit](audit-api-responses.md) and
[surface](find-cosmetic-paywalls.md) for what each plan receives at runtime.
Background: [the REA experiment](../../experiments/rea/README.md).

# Find paywalls that only hide

Layer 3. Use this when the page hides Pro content with CSS (blur,
`display: none`, a lock overlay) and you want to know whether the free page
still holds it.

evershield opens your pages in a headless browser as each identity and
reports content that is in the page but hidden: blurred, `display: none`,
clipped, or tucked into a `data-*` attribute, an inline script or
`localStorage`.

## 1. Install Playwright

```bash
npm install --save-dev playwright && npx playwright install chromium
```

## 2. Save a session per identity

```bash
npx playwright codegen --save-storage=free.json https://staging.example.com   # log in as a free user
npx playwright codegen --save-storage=pro.json  https://staging.example.com   # log in as a pro user
```

Keep these files out of git.

## 3. Describe the pages

```json
{
  "surface": {
    "baseUrl": "https://staging.example.com",
    "tiers": ["free", "pro"],
    "identities": {
      "free": { "storageState": "${EVERSHIELD_FREE_STATE}" },
      "pro":  { "storageState": "${EVERSHIELD_PRO_STATE}" }
    },
    "pages": [{ "path": "/report/demo" }]
  }
}
```

## 4. Run it

```bash
EVERSHIELD_FREE_STATE=free.json EVERSHIELD_PRO_STATE=pro.json npx evershield surface
```

The key rule compares tiers: text the Pro page shows that the Free page also
contains, hidden, is a cosmetic paywall. Tabs and menus hidden for everyone
never trigger it.

See also: [surface rules](../rules.md#layer-3-surface),
[surface configuration](../configuration.md#surface-layer-3).

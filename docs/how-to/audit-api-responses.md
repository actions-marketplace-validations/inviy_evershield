# Audit what each plan receives from your API

Layer 2. Use this when your API decides per plan what to return and you want
CI to fail if a lower plan receives a higher plan's fields.

## 1. Describe the identities

Credentials are referenced from environment variables, never written in the
config:

```json
{
  "audit": {
    "baseUrl": "https://api.example.com",
    "tiers": ["anonymous", "free", "pro"],
    "identities": {
      "anonymous": {},
      "free": { "headers": { "Authorization": "Bearer ${EVERSHIELD_FREE_TOKEN}" } },
      "pro":  { "headers": { "Authorization": "Bearer ${EVERSHIELD_PRO_TOKEN}" } }
    },
    "endpoints": [
      {
        "method": "POST",
        "path": "/api/analyze",
        "body": { "text": "sample" },
        "tiered": true,
        "expect": { "free": { "absent": ["perplexity", "burstiness"] } }
      }
    ]
  }
}
```

## 2. Run the audit

```bash
EVERSHIELD_FREE_TOKEN=… EVERSHIELD_PRO_TOKEN=… npx evershield audit
```

## What it reports

- fields the config says a tier must not receive
- fields whose names mark them as a higher tier's (`premium_*`, `pro_only`, `internal_*`)
- credential-like fields in any response
- endpoints that answer every identity identically

The audit only ever talks to `baseUrl`.

See also: [response rules](../rules.md#layer-2-response),
[audit configuration](../configuration.md#audit-layer-2).

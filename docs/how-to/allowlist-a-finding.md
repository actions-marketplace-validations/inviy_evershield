# Allowlist a known-safe finding

Known-safe matches go in `evershield.config.json`, each with a reason:

```json
{
  "ignore": [
    {
      "ruleId": "artifact/internal-endpoint",
      "match": "localhost:9999",
      "reason": "supabase-js bundles this fallback URL; unreachable in production"
    }
  ]
}
```

evershield refuses a config whose ignores have no `reason`, and reports how
many findings the config removed.

See also: [ignore configuration](../configuration.md#ignore).

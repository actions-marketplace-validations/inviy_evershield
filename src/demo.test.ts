import assert from "node:assert/strict";
import test from "node:test";

import { run } from "./cli.ts";
import { runDemo, startDemoServer } from "./demo.ts";

test("demo server withholds Pro fields from free users only when fixed", async () => {
  for (const mode of ["leaky", "fixed"] as const) {
    const server = await startDemoServer(mode);
    try {
      const free = (await (await fetch(`${server.origin}/api/report`)).json()) as Record<string, unknown>;
      const pro = (await (await fetch(`${server.origin}/api/report`, { headers: { authorization: "Bearer pro-demo" } })).json()) as Record<string, unknown>;
      assert.equal(pro.burstiness, 0.82, `${mode}: pro always gets the metric`);
      assert.equal("burstiness" in free, mode === "leaky", `${mode}: free gets the metric only when leaky`);
      const map = await fetch(`${server.origin}/assets/main.js.map`);
      assert.equal((await map.text()).includes("sourcesContent"), mode === "leaky", `${mode}: source map only when leaky`);
    } finally {
      await server.close();
    }
  }
});

test("leaky demo reports the response and artifact leaks", async () => {
  const result = await runDemo("leaky", { noBrowser: true });
  const rules = new Set(result.findings.map((finding) => finding.ruleId));
  assert.ok(rules.has("response/expected-absent-field-present"));
  assert.ok(rules.has("artifact/secret-like-string"));
  assert.ok(rules.has("artifact/source-map-published"));
  assert.equal(result.layers.find((layer) => layer.name === "surface")?.skipped, "skipped (--no-browser)");
});

test("fixed demo reports nothing", async () => {
  const result = await runDemo("fixed", { noBrowser: true });
  assert.deepEqual(result.findings, []);
});

test("demo command exits 0 even though the app leaks, and never prints the key", async () => {
  const result = await run(["demo", "--no-browser"]);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /The paywall was CSS/);
  assert.ok(!result.stdout.includes("Ex4mpl3NotARealKey"));
  const json = await run(["demo", "--no-browser", "--format", "json"]);
  const parsed = JSON.parse(json.stdout) as { demo: string; blocking: number };
  assert.equal(parsed.demo, "leaky");
  assert.ok(parsed.blocking > 0);
  assert.equal((await run(["demo", "--format", "sarif"])).code, 2);
});

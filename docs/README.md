# evershield documentation

Pick the page by what you are trying to do.

## Learning: start here

- [Your first evershield run](tutorial.md): demo, setup, a first scan of your own build

## Doing a specific task

- [Audit what each plan receives from your API](how-to/audit-api-responses.md) (layer 2)
- [Find paywalls that only hide](how-to/find-cosmetic-paywalls.md) (layer 3)
- [Scan a build or app package](how-to/scan-the-build.md) (layer 1)
- [Check what reverse engineers get](how-to/check-what-reverse-engineers-get.md)
- [Run evershield in CI](how-to/run-in-ci.md)
- [Use evershield from a coding agent](how-to/use-with-coding-agents.md)
- [Allowlist a known-safe finding](how-to/allowlist-a-finding.md)

## Looking something up

- [CLI and Action reference](reference/cli.md): commands, options, exit codes, Action inputs
- [Rules](rules.md): every rule and why it has its severity and confidence
- [Configuration](configuration.md): every config key

## Understanding why

- [Design](design.md): the problem, the three layers, non-goals, roadmap, prior art
- [False-positive corpus](corpus.md): how rule changes are measured on real code
- [The REA experiment](../experiments/rea/README.md): evershield against a reverse-engineering tool

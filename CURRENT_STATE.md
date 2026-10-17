# VOX CURRENT STATE — 17 October 2026

**Production LIVE and user-approved:** https://stanjarin.github.io/Vox/ → /wiki/ — iPhone 8 Plus Home Screen app named **Wikipedia**.

**READ FIRST:** [2026-10-17 checkpoint and full handover](docs/checkpoints/2026-10-17_vox-production-and-handover.md).

## Frozen working behaviour
- Fake Wikipedia article, probability table, local Canasta image, compact inert MathWorld source, outer table columns bold.
- 15 seconds of inactivity on Wiki → passcode lock; last article scroll position preserved through arming.
- Four card inputs (Value/Suit/Value/Suit), long hold per input; **ordinary SHORT TAP of 0 AFTER FOUR INPUTS** confirms and writes calculated card position to clipboard; returns to Wiki. Fourth input alone must NOT submit. Four circular fields show inputs for review.
- Cancel = one-step Undo; Emergency = full reset.
- Siri Shortcut EXACT invocation: **“Tell me a number from one to fifty-two”**, response “Let's try N”. “Between one and” invokes regular Siri instead.
- Production user-tested and accepted “Sweet as a nut.” Main promotion commit: `183386e1023da1189c18cff7e94e119a0c81b953`.

## Backup / diagnostics
- `backup-vox-original-before-wiki-2026-10-16`: original v8.4.10.
- `backup-vox-longpress-zero-2026-10-17`: pre-short-tap version.
- `/diagnostic/`: separate browser clipboard error instrumentation; error observed `NotAllowedError` with user activation true in older long-press tests. Root cause unproven; new tap production was successful.
- Current Wiki links at checkpoint: CSS `8.6.20`, JS `8.6.21`; inspect actual files before modifying, bypass cache on changed assets.

**Development rule:** Stable live production is not a laboratory. Back up, use staging/diagnostic when exploring uncertain failures, verify GitHub writes and have user test actual iPhone before declaring behavioural success.

Latest full detail: `docs/checkpoints/2026-10-17_vox-production-and-handover.md`.

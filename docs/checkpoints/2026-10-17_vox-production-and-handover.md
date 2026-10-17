# VOX checkpoint — 17 October 2026

## Status
**Production operational, approved by Stanley's iPhone 8 Plus test:** “Sweet as a nut.” Published at https://stanjarin.github.io/Vox/ (root redirects to /wiki/). Installed as **Wikipedia** Home Screen app using `icon.png`; this is the real performance vehicle, Safari is only a test surface.

GitHub repository: `stanjarin/Vox`, production branch `main`. **Do not improvise changes to working production.** Check current heads before edits, save rollback before substantial changes, test iPhone, then promote. After updates, verify file contents and cache-bust assets when necessary.

## Performance effect and operation
- Deck: 52 cards in Tamariz Mnemonica order; Charlier shuffle preserves cyclic order; deck placed on table, never touched again by performer.
- Spectator cuts any number of times; marked top card read while consulting probability table and talking, without visibly handling deck.
- Spectator's Siri freely names a card. Performer inputs **named card then top card** in fake iPhone passcode keypad.
- Four inputs in order: Value 1, Suit 1, Value 2, Suit 2. Each selection uses long-press to commit; short taps cycle candidate values/suits. Four distinct circular passcode slots show entries for review.
- **FINAL APPROVED BEHAVIOUR (17 Oct): short TAP 0 confirms only after four entries.** Does not automatically submit on fourth suit. It computes offset, writes result into clipboard, returns to exact remembered Wiki scroll position. Do NOT restore old long-press-0 or fake Home Screen zero behaviours.
- Siri Shortcuts trigger phrase must be EXACT: **“Tell me a number from one to fifty-two”**, NOT “between one and fifty-two”. Correct Shortcut speaks **“Let's try [n]”**. If Siri says “The answer is…”, it may be answering independently because the wrong trigger phrase was said. Test with 4C and 9D produced 52 in clipboard, correctly announced after correct phrase.
- Siri speaks clipboard result, spectator deals to position; card matches. Original keypad Mnemonica code is in `wiki/app.js`. Do not change calculation without a proven cause and regression tests.

## Current UI
- Entry: fake Wikipedia article, heading Cut (cards), Canasta photograph in `wiki/canasta.jpg` (local, no Wikimedia fetch), probability table 1–12 cuts, counts `51^n`; figures count ordered **sequences**, not distinct final deck arrangements (cyclic order preserved). Six cuts = **17,596,287,801** sequences (~17.6 billion).
- Table **Cuts** and **Approx** outer columns extra-bold (900), middle column regular. Below table: compact source credit, “Source: Weisstein, E. W., ‘Multiplication Principle,’ MathWorld.” MathWorld styled blue but intentionally INERT, never navigates during act.
- Starts at predetermined scroll position near end of Canasta photo and probability table; scroll position preserved through lock/arm. **15 seconds of INACTIVITY after last Wiki interaction** triggers fake passcode. Scroll/touch/interaction resets timeout. Timer resumes after successful arming.
- Fake passcode has no padlock icon; four circular input slots; keypad and caption raised; buttons **Emergency** full reset, **Cancel** one-step Undo. Both positioned relative to keypad's zero row, not viewport bottom. iPhone Home Screen app display differs from Safari with browser furniture.
- `wiki/index.html` loads `styles.css?v=8.6.20` and `app.js?v=8.6.21` at this checkpoint. **Versions in URL are cache keys, not necessarily code release numbers.** Check live files before changing.

## Clipboard investigation — resolved operationally, not as a platform theory
- Older **long-press 0** sometimes yielded `!`; actual diagnostic showed Promise rejection **NotAllowedError** from `navigator.clipboard.writeText` despite secure context, clipboard API available, `navigator.userActivation.isActive=true`, four valid inputs.
- Diagnostic at `/diagnostic/` gives detailed alert with stage/error/userActivation; separate files `diagnostic/app.js`, `diagnostic/index.html` (may diverge from current production). Production untouched during diagnostics. Tests of short tap vs hold varied between Safari and Home Screen; do not claim a fully established root cause.
- Crucial user test: short tap 0 in Home Screen app successfully copied correct result **52** to clipboard; incorrect Siri replies had been caused by accidentally saying **“between one and”** instead of Shortcut's exact **“from one to”**. Correct invocation yielded “Let's try 52.”
- **Short tap 0 promoted to production** commit `183386e1023da1189c18cff7e94e119a0c81b953`. User tested and accepted: “Sweet as a nut.” The production Clipboard API still may have platform constraints; no new failure reported after promotion.
- A speculative retry patch was deliberately rolled back; do not reintroduce workaround without verified reason.

## Backups and safe development
- `backup-vox-original-before-wiki-2026-10-16` — original standalone VOX v8.4.10 before Wiki as default.
- `backup-vox-longpress-zero-2026-10-17` — before promoting ordinary short tap 0 confirmation.
- `vox-clipboard-diagnostics-2026-10-16` — diagnostic development branch (separate diagnostic page is also published on main).
- Older original `app.js` still at root, preserved; root `index.html` simply redirects to `wiki/`.

## Performance framing
- Publicly acknowledged Siri-to-Siri **technology is the PREMISE, not the concealed method**. The joke is two supposedly helpful AIs conspiring behind people's backs (“friendly, beneficial parasites” in billions of pockets).
- Clarke's Third Law: “Any sufficiently advanced technology is indistinguishable from magic.” Suitable ASM or general-audience preamble.
- Comedic probability patter: six genuine cuts correspond to about seventeen and a half billion **ordered cut sequences**. Acknowledge these are NOT distinct final deck orders if pressed.
- Persona: dry professorial experimenter; overt technological “conspiracy” between two phones; performer stops touching deck after shuffle. No need to hide that phones/AI are involved.
- Related Tamariz/ASM writing is NOT necessarily stored in this repo. User sought exact intro around 15 Oct; some recovered lines discussed genius of engineered comedy/magic but complete original draft not verified. Do not pretend partial snippets are complete.

## Next steps
Production is STABLE; only cosmetic refinements as requested. Before edits, inspect latest GitHub current files, protect a rollback for nontrivial modifications, verify writes, and test on iPhone. Cross-thread briefing: read this checkpoint and `CURRENT_STATE.md` before acting. No gratuitous sheep/ewe jokes: “new ewe” is reserved by user for introduction of an assistant in a fresh project thread.

VOX V8.4.10 — CANONICAL KNOWN-GOOD BUILD — VERIFIED WORKING.

Status:
- V8.4.10 is frozen as the current known-good VOX build.
- Clipboard repair verified end-to-end on iPhone/Siri.
- Do not alter working machinery without a new version.

V8.4.10 change:
- Final suit HOLD calls clipboard write directly from the pointerup user gesture.
- Clipboard path simplified to one immediate navigator.clipboard.writeText() call.
- Removed triple asynchronous writes and deprecated execCommand fallback.
- Visible build number and cache-busting references updated to 8.4.10.

Unchanged from V8.4.9:
- Fake passcode input and rank/suit handling.
- Quick route / 0 delay (8 seconds).
- Mnemonica calculation.
- Fake/final Home.
- Emergency machinery.

Verified end-to-end tests:
- 4C -> 9D = 2
- KC -> JH = 51
- AC -> 4D = 2

All three tests completed the full chain:
fake passcode input -> Mnemonica calculation -> clipboard -> fake Home -> Siri -> correct number.

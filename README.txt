VOX V8.4.10 — clipboard repair only.

Changes only:
- Final suit HOLD now calls clipboard write directly from the pointerup user gesture.
- Clipboard path simplified to one immediate navigator.clipboard.writeText() call.
- Removed triple asynchronous writes and deprecated execCommand fallback.
- Visible build number and cache-busting references updated to 8.4.10.

Unchanged:
- Fake passcode input and rank/suit handling.
- Quick route / 0 delay (8 seconds).
- Mnemonica calculation.
- Fake/final Home.
- Emergency machinery.

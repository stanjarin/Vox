VOX V8.1 — refinement of the verified V8 architecture

V8 remains the rollback baseline.

V8.1 changes:
- Uses the user's supplied dotted lock-screen wallpaper texture throughout the fake Lock interface.
  The texture is cropped from the supplied screenshot; it is not generated/redrawn.
- Uses the user's exact supplied Home-screen screenshot as:
  (a) the Delay waiting screen, and
  (b) the post-calculation closing screen.
- After the fourth lock: calculate -> Clipboard -> fake Home screenshot.
  Physical Home press then swaps fake Home for real Home with minimal visible change.
- Delay route remains:
  after Card 1, press 0 -> fake Home -> 30 seconds -> fake Lock ready for Card 2.
- Suit wheel blank-state bug fixed; every suit phase explicitly opens on C.
- Spinner deliberately made substantially zippier:
  stronger flick launch, longer/faster glide, quicker settling.
- Initial Card 1 value remains 9.
- Emergency remains a hard reset.
- Verified Mnemonica table, rotation arithmetic, Clipboard handoff and Siri end are unchanged.

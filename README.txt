VOX V8.3.1 — two-point repair only

1. Fixes freeze immediately after first rank/value input.
   Cause: rank mode replaced the 9-key's DOM contents and destroyed the suit wheel track.
   The track is now preserved and simply displays 9 while inactive.

2. The Ace position on the 1-key is displayed as "1", not "A".
   Internally it is still captured as Ace for the Mnemonica lookup.

No other V8.3 behavior changed.

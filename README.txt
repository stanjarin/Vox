VOX V8.4.2 — final-input/clipboard fix.

Root cause of “Card 2 value disappears on suit lock”:
the long-hold timer was completing the card before finger-up. That meant the clipboard write occurred outside the final user gesture; iOS could reject it, triggering the fail-safe that intentionally retained only Card 1.

Fix:
- hold timer now only ARMS the selection;
- actual lock/phase advance happens on finger release;
- final Card 2 suit release therefore performs clipboard write within the user gesture;
- no other V8.4 behavior changed.

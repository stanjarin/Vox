VOX V8.4.6 — clipboard reliability + fail-safe preservation.

Visible build number: 8.4.6

Final Card-2 suit behavior changed:
- tap still cycles suit;
- hold still means commit;
- on the final hold, the app calculates the answer and attempts clipboard copy BEFORE irreversibly committing the suit;
- if copy succeeds: suit is committed and fake Home appears;
- if copy fails: app stays on Card-2 suit, shows the prospective suit plus !, and NOTHING is lost.
  You can tap to change the suit or hold again to retry.

Clipboard copy now first uses a tiny in-viewport input with synchronous execCommand('copy'), then the Clipboard API as fallback.

No Mnemonica, arithmetic, delay, Emergency, or visual behavior changed.

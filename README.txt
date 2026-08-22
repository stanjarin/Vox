VOX V8.4.8 — clipboard reliability pass only.

NO card-input/state changes from V8.4.7.

After the final Card-2 suit commit:
- calculates the verified Mnemonica result;
- immediately fires three Clipboard API write attempts from the same final user gesture;
- if none succeeds, tries the legacy copy fallback;
- fake Home appears only after a successful copy;
- if all attempts fail, all four card inputs remain visible and a faint ! appears;
- another hold on the same suit retries the clipboard write without re-entering either card.

Visible build number: 8.4.8

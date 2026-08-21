VOX covert-input prototype V6 — calculation/clipboard proof.

Same V4 interface and handling.

After Card 2 locks:
- Card 1 is treated as Named Card.
- Card 2 is treated as Inputted/key card.
- Full 52-card Mnemonica dictionary is looked up.
- Marked-deck/top-card formula:
  Inputted Card Value - Named Card Value + 1
- Result is wrapped into 1..52.
- Final position is copied to clipboard.
- A diagnostic screen shows both card positions, raw arithmetic, normalized result, and clipboard status.

V6 deliberately does NOT exit to Home yet.

VOX covert-input prototype V7 — corrected rotating-stack arithmetic.

V6's 52-card Mnemonica dictionary was correct; the subtraction direction was wrong.

Correct marked-deck/top-card calculation:
  Named Card Value - Inputted/key Card Value + 1
then wrap into 1..52.

Anchor check when 8H (Mnemonica 14) is the top/key card:
  8H -> 1
  3H (28) -> 15
  9D (52) -> 39

V7 still shows the diagnostic screen and copies the normalized final position to clipboard.

VOX V8.4.7 — rollback to known-good V8 clipboard path.

Retained:
- V8.4 tap-cycle rank/suit input
- press-and-hold lock
- 15-second Delay via 0
- Emergency reset
- current visuals/backgrounds
- visible version number

Changed:
- removed all experimental clipboard workarounds added after V8
- restored the exact clipboard implementation from the proven V8 build
- final Card-2 suit now commits on finger release, then calls that original V8 finish() path

Visible build number: 8.4.7

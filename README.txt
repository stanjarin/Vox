VOX V8.4.5 — exact suit-handler repair.

The previous repair had not actually replaced the live suit handler.
Verified source showed suit hold was STILL committing/advancing inside the hold timer.

V8.4.5:
- suit hold timer ONLY arms the lock;
- suit is captured and phase advances ONLY on finger release;
- therefore final Card-2 suit release performs finish()/clipboard from the actual user gesture;
- visible build number updated to 8.4.5.
No other behavior changed.

---
"porto": patch
---

Added `waitForReady` property to `Bridge` messenger. This will return a pending promise if the receiving end has not instantiated yet, and will immediately resolve if it has.

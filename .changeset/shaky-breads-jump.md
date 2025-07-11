---
"porto": patch
---

Fixed an issue where headless methods on the `Dialog.popup` renderer would invoke
a popup, instead of calling the method in the background.

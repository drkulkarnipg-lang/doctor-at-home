# One-time source inventory refresh trigger

This file exists only to run the one-time workflow that regenerates `data/external-link-inventory-2026-10-30.json` from the current source tree. It is excluded from the link inventory. The workflow removes itself in the same commit as the regenerated inventory; no application code or patient data is modified.

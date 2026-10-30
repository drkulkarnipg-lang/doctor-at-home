# Current-main external-link audit trigger

Created 30 October 2026 to rerun the repository's existing external-link audit against the current main snapshot `1ccd34769734b30e83d1ce9ab1bad34a221446ec`.

This file is only an audit trigger and is excluded from the source inventory. The workflow generates a fresh source inventory, checks public external destinations with bounded concurrency, and preserves blocked/rate-limited responses as unverified rather than automatically labelling them broken. No application code or production data is changed by this branch.

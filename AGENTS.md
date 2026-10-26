# Continuity and checkpoints

- Before starting or resuming work, read `WORK_CHECKPOINT.md` and the authoritative current section of `PROJECT_STATUS.md`. Inspect Git branch/head and the recorded review PR before editing.
- After every completed small implementation or verification step, update the checkpoint with the change, evidence, exact remaining work and next action. Commit and synchronize it to the existing GitHub review branch before starting a longer operation or ending the turn. A local commit alone is not durable enough.
- Record interrupted or failed checks explicitly. Resume the next unfinished action; do not restart completed work or require the owner to repeat requirements.
- Keep production, preview and unverified integration states separate. Preserve the owner's preview-before-publication preference unless publication of the specific change is explicitly authorised.
- Preserve existing facilities, two main tabs, current contact number and safety/data-isolation checks. Do not silently substitute ambiguous medicine names or infer prescribing regimens.
- Never commit credentials or real patient information. Use synthetic document fixtures for layout checks. Temporary previews and generated QA files are excluded from source commits.

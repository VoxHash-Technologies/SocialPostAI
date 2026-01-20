# Troubleshooting

## Missing Commands
- Ensure VS Code was launched with `code --extensionDevelopmentPath packages/extension`
- Re-run `npm run build` to regenerate dist output

## Auth Prompts Repeating
- Threads: confirm `socialpostai.threadsUserId` is set
- Clear secrets in VS Code Secret Storage, then re-enter credentials

## Bluesky Mentions Not Linked
- Provide a handle→DID map to `parseFacets` or ensure handles resolve via your backend
- Verify text is UTF-8 and within 300 characters

## Scheduling Not Firing
- Ensure VS Code remains open and not sleeping
- Check output channel for job id and timing; reschedule if the timestamp was in the past

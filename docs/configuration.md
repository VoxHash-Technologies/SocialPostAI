# Configuration

| Setting | Description | Required | Stored |
| --- | --- | --- | --- |
| `socialpostai.threadsToken` | Threads Graph API access token | Yes (Threads) | Secret Storage |
| `socialpostai.threadsUserId` | Threads user id for publishing | Yes (Threads) | Settings |
| `socialpostai.blueskyHandle` | Bluesky handle (user@domain) | Yes (Bluesky) | Settings |

## Token Flow
- Threads token is read from Secret Storage or prompted, then stored securely.
- Threads user id is stored in settings to build the publish endpoint.
- Bluesky app password is prompted and stored in Secret Storage; handle remains in settings.

## Updating Credentials
- Run any publish command; the extension will prompt again if a secret is missing.
- To reset secrets, clear them from VS Code Secret Storage (`Developer: Open Secret Storage`).

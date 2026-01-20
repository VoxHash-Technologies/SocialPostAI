# Architecture

- `packages/core`: intent detection, text normalization, payload builders, facet parsing
- `packages/adapters`: platform-specific request preparation for Threads Graph API and Bluesky AT Protocol
- `packages/scheduler`: local timer-based scheduling with per-platform execution
- `packages/extension`: VS Code/VSCodium integration (commands, auth prompts, previews, scheduling)

## Data Flow
1. User selects text → `preparePost` normalizes and detects intent
2. Commands build platform payloads via adapters
3. Auth secrets are retrieved from VS Code Secret Storage
4. Requests are logged for inspection; scheduling queues execution locally

## Privacy & Security
- No telemetry or background network calls
- Tokens and app passwords are stored only in Secret Storage
- Publish actions are explicit; scheduling requires VS Code to remain open

# SocialPostAI

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg) ![VSCode](https://img.shields.io/badge/VS%20Code-%5E1.85-blue) ![Status](https://img.shields.io/badge/Status-Active-success)

SocialPostAI is an editor-native publishing copilot for Threads and Bluesky, built by VoxHash Technologies. Draft, adapt, validate, preview, schedule, and prepare platform-native payloads without leaving Cursor or VSCodium.

## Features
- Draft from code, diffs, or free text with intent detection and tone control
- Platform-native payload prep (Threads Graph API, AT Protocol createRecord)
- Bluesky facet parsing for links and mentions
- Secure token handling via VS Code Secret Storage
- Local scheduling for Threads and Bluesky dispatch
- Preview commands with platform-specific validation

## Quick Start
1) `npm install`  
2) `npm run build`  
3) Launch VS Code with the extension for development:  
   `code --extensionDevelopmentPath packages/extension`  
4) In VS Code, open the Command Palette and run `SocialPostAI: Draft Post`  
5) Add credentials when prompted (Threads token + user id, Bluesky handle + app password)  
6) Preview, publish now, or schedule a post

## Installation
- Requirements: Node.js 18+, npm 10+, VS Code/VSCodium ^1.85  
- Install dependencies: `npm install`  
- Build all packages: `npm run build`  
- Run tests: `npm test`  
- Optional: format code `npm run format`

## Usage
- Draft: select text or run `SocialPostAI: Draft Post`
- Preview: `SocialPostAI: Preview Posts` (renders Threads + Bluesky versions)
- Publish: `SocialPostAI: Publish to Threads`, `...Bluesky`, or `...Publish to All Platforms`
- Schedule: choose “Schedule later” during publish flow and provide an ISO timestamp

## Configuration
| Key | Description | Required | Scope |
| --- | --- | --- | --- |
| `socialpostai.threadsToken` | Threads access token (stored securely) | Yes (Threads) | application |
| `socialpostai.threadsUserId` | Threads user id for Graph API publishing | Yes (Threads) | application |
| `socialpostai.blueskyHandle` | Bluesky handle (user@domain) | Yes (Bluesky) | application |

## Examples
- End-to-end draft and preview: see `docs/examples/example-01.md`
- Scheduled cross-post: see `docs/examples/example-02.md`

## Roadmap
- Hardened retry/backoff for publish adapters
- Multi-account profiles
- Rich preview webview with facet inspector
- Telemetry-free usage analytics (local only)

## Contributing
See `CONTRIBUTING.md` for setup, branch strategy, and review guidelines.

## License
MIT. See `LICENSE`.

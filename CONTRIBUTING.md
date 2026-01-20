# Contributing to SocialPostAI

Thanks for helping improve SocialPostAI by VoxHash Technologies.

## Workflow
- Fork or branch from `main`
- Create small, focused PRs with clear titles
- Keep changes scoped to the described issue
- Add or update docs when behavior changes

## Setup
1) `npm install`  
2) `npm run build`  
3) `npm test` (core + adapters)  
4) `npm run format` if you touched formatting

## Extension Development
- Launch VS Code with `code --extensionDevelopmentPath packages/extension`
- Run commands from the Command Palette:
  - SocialPostAI: Draft Post
  - SocialPostAI: Preview Posts
  - SocialPostAI: Publish to Threads / Publish to Bluesky / Publish to All Platforms

## Commit Style
- Use present tense (e.g., `Add scheduler queue`)
- Include scope when helpful (e.g., `core: tighten facet parser`)

## Tests & Quality
- Keep adapters deterministic; avoid live network calls in tests
- Prefer unit coverage for parsers and payload builders
- Run `npm test` before opening a PR

## Security & Privacy
- Never commit tokens or app passwords
- Use VS Code Secret Storage for local development credentials
- Report security issues privately (see `SECURITY.md`)

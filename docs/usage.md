# Usage

## Draft from Selection
- Select text or code
- Run `SocialPostAI: Draft Post`
- Pick tone (professional, casual, technical, launch, neutral)
- Preview appears in the SocialPostAI output channel

## Preview
- Run `SocialPostAI: Preview Posts` to regenerate previews without scheduling or publishing

## Publish
- `SocialPostAI: Publish to Threads`
- `SocialPostAI: Publish to Bluesky`
- `SocialPostAI: Publish to All Platforms`
- Choose “Publish now” or “Schedule later” and provide ISO timestamp

## Scheduling Notes
- Scheduler is local and requires VS Code to remain open
- Jobs are identified by an id logged to the output channel
- Rescheduling is possible via code (see `@voxhash/socialpostai-scheduler`)

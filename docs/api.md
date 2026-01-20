# API

## Core (`@voxhash/socialpostai-core`)
- `preparePost(input, tone)` → `{ text, intent, tone }`
- `buildThreadsPayload(post, visibility?)` → Threads Graph payload
- `buildBlueskyPayload(post, facetOptions?)` → AT Protocol post record
- `parseFacets(text, options?)` → Bluesky facets (links + mentions)

## Adapters (`@voxhash/socialpostai-adapters`)
- `ThreadsAdapter(token, { userId })`  
  - `prepare(post)` → `{ url, method, headers, body }` for `https://graph.threads.net/v1.0/{userId}/threads`
- `BlueskyAdapter(handle, appPassword, options?)`  
  - `prepare(post)` → `{ sessionRequest, buildCreateRecordRequest(session) }`

## Scheduler (`@voxhash/socialpostai-scheduler`)
- `ScheduleManager(executor)`  
  - `schedule(post, platform, runAt, id?)`  
  - `reschedule(id, runAt)`  
  - `cancel(id)`  
  - `list()`  
  - `flush()`

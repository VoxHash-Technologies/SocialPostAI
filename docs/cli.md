# CLI

A dedicated CLI is planned. For now, use the VS Code commands or consume the packages directly:

- `@voxhash/socialpostai-core` for intent detection and payload prep
- `@voxhash/socialpostai-adapters` for platform-specific request building
- `@voxhash/socialpostai-scheduler` for scheduling posts programmatically

Example (Node):
```ts
import { preparePost } from "@voxhash/socialpostai-core";
import { ThreadsAdapter } from "@voxhash/socialpostai-adapters";

const post = preparePost("Launch update", "launch");
const adapter = new ThreadsAdapter(process.env.THREADS_TOKEN!, { userId: process.env.THREADS_USER_ID! });
const request = adapter.prepare(post);
// send request with fetch()
```

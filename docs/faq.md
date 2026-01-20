# FAQ

**Do you send posts automatically?**  
No. The extension prepares requests and schedules them locally. You can inspect every request in the output channel.

**Where are tokens stored?**  
Threads token and Bluesky app password are stored in VS Code Secret Storage. Handles and user ids remain in settings.

**Can I use this with multiple accounts?**  
Not yet. Multi-account support is on the roadmap.

**Does scheduling survive restarts?**  
Currently, scheduling is in-memory. Keep VS Code open until tasks run.

**How are Bluesky mentions resolved?**  
`parseFacets` needs a handle→DID map. Provide it via `handleToDid` or resolve before dispatch.

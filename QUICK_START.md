# Quick Start - Testing SocialPostAI in CursorAI

## Step-by-Step Debugging Guide

### 1. Build the Extension
```bash
npm run build
```

### 2. Launch Extension Development Host

**In CursorAI:**
1. Press `F5` (or `Ctrl+Shift+D` → Run and Debug)
2. Select **"Extension"** from the dropdown
3. Press `F5` again or click the green play button
4. A new window titled **[Extension Development Host]** will open

### 3. Verify Extension is Active

**In the Extension Development Host window:**
- You should see a notification: "SocialPostAI is ready!"
- The Output panel should show "SocialPostAI activated..."

### 4. Test Commands

**In the Extension Development Host window:**

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `SocialPostAI`
3. You should see these commands:
   - ✅ SocialPostAI: Draft Post
   - ✅ SocialPostAI: Draft from Selection
   - ✅ SocialPostAI: Preview Posts
   - ✅ SocialPostAI: Publish to Threads
   - ✅ SocialPostAI: Publish to Bluesky
   - ✅ SocialPostAI: Publish to All Platforms
   - ✅ SocialPostAI: Account & Tokens

### 5. Quick Test (No Auth Required)

1. Create a new file or open any text file
2. Type: `Just shipped a new feature!`
3. Select the text
4. Press `Ctrl+Shift+P`
5. Run: `SocialPostAI: Preview Posts`
6. Select a tone (e.g., "professional")
7. Open **Output** panel (`Ctrl+Shift+U`)
8. Select **"SocialPostAI"** from dropdown
9. You should see:
   ```
   Threads Version:
   Just shipped a new feature!
   
   Bluesky Version:
   Just shipped a new feature!
   ```

### 6. Test Draft from Selection

1. Select some text in the editor
2. Run: `SocialPostAI: Draft from Selection`
3. Select tone
4. Choose "Publish now" (it will prepare requests but won't actually publish)

### 7. Configure Credentials (Optional)

1. Run: `SocialPostAI: Account & Tokens`
2. Select "Configure Threads Token" or "Configure Bluesky Handle"
3. Enter credentials when prompted
4. They're stored securely in VS Code Secret Storage

## Troubleshooting

**Commands not showing?**
- ✅ Ensure you're in the **Extension Development Host** window (not main CursorAI)
- ✅ Check that build succeeded: `npm run build`
- ✅ Reload the Extension Development Host window (`Ctrl+R`)

**Extension not activating?**
- ✅ Check Debug Console in original CursorAI window
- ✅ Look for "SocialPostAI extension activating..." message
- ✅ Check Output → SocialPostAI channel

**Errors?**
- ✅ Check Debug Console for stack traces
- ✅ Check Output → SocialPostAI channel for error messages
- ✅ Ensure all packages are built: `npm run build`

## What's Working

✅ Extension activates on startup  
✅ All commands registered and visible  
✅ Preview functionality (no auth needed)  
✅ Error handling with user-friendly messages  
✅ Secure credential storage  
✅ Scheduled posting (in-memory)  
✅ Platform-specific payload preparation  

## Next Steps

The extension prepares requests but doesn't make actual API calls yet. To complete the workflow:
1. Implement network calls in adapters
2. Test with real API credentials
3. Add unit tests

For detailed testing instructions, see `TESTING.md`.

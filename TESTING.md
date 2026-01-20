# Testing SocialPostAI Extension

## Quick Start Testing in CursorAI

### 1. Build the Extension
```bash
npm run build
```

### 2. Launch Extension Development Host

**Option A: Using Debug Panel (Recommended)**
1. Open the project in CursorAI
2. Press `F5` or go to Run and Debug (`Ctrl+Shift+D`)
3. Select "Extension" from the dropdown
4. Click the green play button or press `F5`
5. A new Extension Development Host window will open

**Option B: Using Command Line**
```bash
codium --extensionDevelopmentPath packages/extension
```

### 3. Verify Extension Activation

When the Extension Development Host opens, you should see:
- A notification: "SocialPostAI is ready! Use Command Palette..."
- The "SocialPostAI" output channel should be visible

### 4. Test Commands

In the **Extension Development Host** window:

1. **Open Command Palette**: `Ctrl+Shift+P` (Linux/Windows) or `Cmd+Shift+P` (Mac)
2. **Search for "SocialPostAI"** - You should see these commands:
   - `SocialPostAI: Draft Post`
   - `SocialPostAI: Draft from Selection`
   - `SocialPostAI: Preview Posts`
   - `SocialPostAI: Publish to Threads`
   - `SocialPostAI: Publish to Bluesky`
   - `SocialPostAI: Publish to All Platforms`
   - `SocialPostAI: Account & Tokens`

### 5. Manual Testing Workflow

#### Test 1: Preview Posts (No Auth Required)
1. Open any text file or create a new file
2. Type some text (e.g., "Just shipped a new feature!")
3. Select the text
4. Run: `SocialPostAI: Preview Posts`
5. Select a tone (e.g., "professional")
6. Check the Output panel → "SocialPostAI" channel
7. You should see "Threads Version:" and "Bluesky Version:" with the text

#### Test 2: Draft from Selection
1. Select some text in the editor
2. Run: `SocialPostAI: Draft from Selection`
3. Select a tone
4. You should see preview in the output channel
5. Choose "Publish now" or "Schedule later"
6. If "Publish now", it will attempt to authenticate

#### Test 3: Configure Settings
1. Run: `SocialPostAI: Account & Tokens`
2. Select "Configure Threads Token" or "Configure Bluesky Handle"
3. Follow the prompts to enter credentials
4. Credentials are stored securely in VS Code Secret Storage

#### Test 4: Publish (Requires Auth)
**Note**: This will prepare requests but won't actually publish unless you implement the network calls.

1. Configure credentials first using `SocialPostAI: Account & Tokens`
2. Select text or run `SocialPostAI: Draft Post`
3. Choose a tone
4. Select "Publish now"
5. Check the Output panel for request details

### 6. Debugging Tips

**Check Extension Logs:**
- In the original CursorAI window, check the Debug Console
- Look for "SocialPostAI extension activating..." message
- Any errors will appear here

**Check Output Channel:**
- In Extension Development Host: View → Output
- Select "SocialPostAI" from the dropdown
- All extension activity is logged here

**Common Issues:**

1. **Commands not appearing:**
   - Ensure extension is built: `npm run build`
   - Check that activation completed (look for notification)
   - Reload the Extension Development Host window

2. **Activation errors:**
   - Check Debug Console in original window
   - Verify all dependencies are installed: `npm install`
   - Check that `dist/extension.js` exists

3. **Commands fail silently:**
   - Check Output panel → SocialPostAI channel
   - Check Debug Console for stack traces
   - Ensure you're testing in the Extension Development Host window, not the main window

### 7. Testing Scheduled Posts

1. Run any draft command
2. Select "Schedule later"
3. Enter a future ISO 8601 timestamp (e.g., `2026-01-20T15:30:00Z`)
4. Check Output panel for confirmation
5. **Important**: Keep VS Code/CursorAI open until the scheduled time

### 8. Testing Facet Parsing (Bluesky)

1. Draft a post with URLs: "Check out https://example.com"
2. Preview or publish to Bluesky
3. Check the payload preview in Output panel
4. Verify facets are correctly parsed with byte indices

## Expected Behavior

✅ Extension activates on startup (due to `"activationEvents": ["*"]`)  
✅ Commands appear in Command Palette  
✅ Preview works without authentication  
✅ Auth prompts appear when needed  
✅ Output channel shows all activity  
✅ Error messages are user-friendly  
✅ Scheduled posts are queued correctly  

## Next Steps

After manual testing passes:
1. Implement actual network calls in adapters (currently only prepares requests)
2. Add unit tests for core utilities
3. Add integration tests for adapters
4. Test with real API credentials (carefully!)

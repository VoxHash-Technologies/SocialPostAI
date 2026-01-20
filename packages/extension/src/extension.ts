import * as vscode from "vscode";
import {
  preparePost,
  PreparedPost,
  buildBlueskyPayload
} from "@voxhash/socialpostai-core";
import {
  BlueskyAdapter,
  ThreadsAdapter
} from "@voxhash/socialpostai-adapters";
import { ScheduleManager } from "@voxhash/socialpostai-scheduler";
import { ensureBlueskyAuth, ensureThreadsAuth } from "./auth";

const output = vscode.window.createOutputChannel("SocialPostAI");
let scheduler: ScheduleManager | null = null;

function getScheduler(executor: (post: PreparedPost, platform: "threads" | "bluesky") => Promise<void>) {
  if (!scheduler) {
    scheduler = new ScheduleManager(executor);
  }
  return scheduler;
}

function pickTone(): Promise<PreparedPost["tone"]> {
  return vscode.window.showQuickPick(
    ["professional", "casual", "technical", "launch", "neutral"],
    {
      title: "Select tone",
      placeHolder: "Tone affects phrasing and brevity"
    }
  ) as Promise<PreparedPost["tone"]>;
}

async function getSelectedTextOrPrompt(): Promise<string> {
  const editor = vscode.window.activeTextEditor;
  const selection = editor?.document.getText(editor.selection);
  if (selection && selection.trim()) return selection.trim();

  const clipboard = await vscode.env.clipboard.readText();
  const preferClipboard = clipboard && clipboard.trim().length > 0;

  const input = await vscode.window.showInputBox({
    title: "Provide context for the post",
    value: preferClipboard ? clipboard.trim() : undefined,
    ignoreFocusOut: true,
    prompt: "Paste code, diff, or text to draft."
  });

  if (!input) {
    throw new Error("No content provided.");
  }

  return input.trim();
}

function renderPreview(post: PreparedPost) {
  output.appendLine("Threads Version:");
  output.appendLine(post.text);
  output.appendLine("");
  output.appendLine("Bluesky Version:");
  output.appendLine(post.text);
  output.appendLine("");
  vscode.window.showInformationMessage("Preview generated in the SocialPostAI output channel.");
}

async function prepareThreadsRequest(
  context: vscode.ExtensionContext,
  post: PreparedPost
): Promise<{ summary: string }> {
  const auth = await ensureThreadsAuth(context);
  const adapter = new ThreadsAdapter(auth.token, { userId: auth.userId });
  const request = adapter.prepare(post);
  const summary = [
    "[Threads]",
    `${request.method} ${request.url}`,
    `Headers: ${JSON.stringify(request.headers)}`,
    `Body: ${request.body}`
  ].join("\n");
  return { summary };
}

async function prepareBlueskyRequests(
  context: vscode.ExtensionContext,
  post: PreparedPost
): Promise<{ session: string; payloadPreview: string }> {
  const auth = await ensureBlueskyAuth(context);
  const adapter = new BlueskyAdapter(auth.handle, auth.appPassword);
  const prepared = adapter.prepare(post);

  const sessionSummary = [
    "[Bluesky session]",
    `${prepared.sessionRequest.method} ${prepared.sessionRequest.url}`,
    `Body: ${prepared.sessionRequest.body}`
  ].join("\n");

  const payloadPreview = [
    "[Bluesky createRecord payload preview]",
    JSON.stringify(buildBlueskyPayload(post, {}), null, 2),
    "Headers will include Authorization: Bearer accessJwt after session creation."
  ].join("\n");

  return { session: sessionSummary, payloadPreview };
}

async function scheduleOrRun(
  context: vscode.ExtensionContext,
  post: PreparedPost,
  platforms: ("threads" | "bluesky")[]
) {
  const mode = await vscode.window.showQuickPick(["Publish now", "Schedule later"], {
    title: "Choose when to publish"
  });
  if (!mode) return;

  const executor = async (p: PreparedPost, platform: "threads" | "bluesky") => {
    if (platform === "threads") {
      const { summary } = await prepareThreadsRequest(context, p);
      output.appendLine(summary);
    } else {
      const prepared = await prepareBlueskyRequests(context, p);
      output.appendLine(prepared.session);
      output.appendLine(prepared.payloadPreview);
    }
  };

  if (mode === "Publish now") {
    for (const platform of platforms) {
      await executor(post, platform);
    }
    vscode.window.showInformationMessage("Requests prepared. Review details in the SocialPostAI output channel.");
    return;
  }

  const when = await vscode.window.showInputBox({
    title: "Schedule time (ISO 8601, e.g., 2026-01-20T15:30:00Z)",
    prompt: "The extension queues the task locally; keep VS Code running until it executes."
  });
  if (!when) return;
  const runAt = new Date(when);
  if (Number.isNaN(runAt.getTime()) || runAt.getTime() <= Date.now()) {
    vscode.window.showErrorMessage("Invalid schedule time. Use a future ISO 8601 timestamp.");
    return;
  }

  const manager = getScheduler(executor);
  for (const platform of platforms) {
    const job = manager.schedule(post, platform, runAt);
    output.appendLine(
      `Scheduled ${platform} post (${job.id}) at ${runAt.toISOString()}`
    );
  }
  vscode.window.showInformationMessage("Scheduled. Keep VS Code open for execution.");
}

async function handleDraft(context: vscode.ExtensionContext) {
  try {
    const text = await getSelectedTextOrPrompt();
    const tone = (await pickTone()) ?? "neutral";
    const post = preparePost(text, tone);
    renderPreview(post);
    await scheduleOrRun(context, post, ["threads", "bluesky"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`SocialPostAI: ${message}`);
    output.appendLine(`Error: ${message}`);
  }
}

async function handleDraftFromSelection(context: vscode.ExtensionContext) {
  try {
    const editor = vscode.window.activeTextEditor;
    const selection = editor?.document.getText(editor.selection);
    if (!selection || !selection.trim()) {
      vscode.window.showWarningMessage("No text selected. Please select text first.");
      return;
    }
    const text = selection.trim();
    const tone = (await pickTone()) ?? "neutral";
    const post = preparePost(text, tone);
    renderPreview(post);
    await scheduleOrRun(context, post, ["threads", "bluesky"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`SocialPostAI: ${message}`);
    output.appendLine(`Error: ${message}`);
  }
}

async function handlePreview() {
  try {
    const text = await getSelectedTextOrPrompt();
    const tone = (await pickTone()) ?? "neutral";
    const post = preparePost(text, tone);
    renderPreview(post);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`SocialPostAI: ${message}`);
    output.appendLine(`Error: ${message}`);
  }
}

async function handlePublishThreads(context: vscode.ExtensionContext) {
  try {
    const text = await getSelectedTextOrPrompt();
    const tone = (await pickTone()) ?? "neutral";
    const post = preparePost(text, tone);
    await scheduleOrRun(context, post, ["threads"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`SocialPostAI: ${message}`);
    output.appendLine(`Error: ${message}`);
  }
}

async function handlePublishBluesky(context: vscode.ExtensionContext) {
  try {
    const text = await getSelectedTextOrPrompt();
    const tone = (await pickTone()) ?? "neutral";
    const post = preparePost(text, tone);
    await scheduleOrRun(context, post, ["bluesky"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`SocialPostAI: ${message}`);
    output.appendLine(`Error: ${message}`);
  }
}

async function handlePublishAll(context: vscode.ExtensionContext) {
  try {
    const text = await getSelectedTextOrPrompt();
    const tone = (await pickTone()) ?? "neutral";
    const post = preparePost(text, tone);
    await scheduleOrRun(context, post, ["threads", "bluesky"]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`SocialPostAI: ${message}`);
    output.appendLine(`Error: ${message}`);
  }
}

async function handleSettings(context: vscode.ExtensionContext) {
  try {
    const action = await vscode.window.showQuickPick(
      [
        { label: "Configure Threads Token", value: "threads" },
        { label: "Configure Bluesky Handle", value: "bluesky" },
        { label: "Clear All Credentials", value: "clear" }
      ],
      {
        title: "SocialPostAI Settings",
        placeHolder: "Select an action"
      }
    );

    if (!action) return;

    if (action.value === "threads") {
      await ensureThreadsAuth(context);
      vscode.window.showInformationMessage("Threads authentication configured.");
    } else if (action.value === "bluesky") {
      await ensureBlueskyAuth(context);
      vscode.window.showInformationMessage("Bluesky authentication configured.");
    } else if (action.value === "clear") {
      const confirmed = await vscode.window.showWarningMessage(
        "Clear all stored credentials?",
        { modal: true },
        "Yes",
        "No"
      );
      if (confirmed === "Yes") {
        const { clearSecrets } = await import("./auth");
        await clearSecrets(context);
        vscode.window.showInformationMessage("All credentials cleared.");
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    vscode.window.showErrorMessage(`SocialPostAI: ${message}`);
    output.appendLine(`Error: ${message}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("SocialPostAI extension activating...");
  
  context.subscriptions.push(
    vscode.commands.registerCommand("socialpostai.draft", () => handleDraft(context)),
    vscode.commands.registerCommand("socialpostai.draftFromSelection", () => handleDraftFromSelection(context)),
    vscode.commands.registerCommand("socialpostai.preview", () => handlePreview()),
    vscode.commands.registerCommand("socialpostai.publishThreads", () =>
      handlePublishThreads(context)
    ),
    vscode.commands.registerCommand("socialpostai.publishBluesky", () =>
      handlePublishBluesky(context)
    ),
    vscode.commands.registerCommand("socialpostai.publish", () => handlePublishAll(context)),
    vscode.commands.registerCommand("socialpostai.settings", () => handleSettings(context))
  );

  output.appendLine("SocialPostAI activated. Use the Command Palette to draft or publish.");
  output.show();
  console.log("SocialPostAI extension activated successfully.");
  vscode.window.showInformationMessage("SocialPostAI is ready! Use Command Palette (Ctrl+Shift+P) and search for 'SocialPostAI'.");
}

export function deactivate() {
  scheduler?.flush();
}

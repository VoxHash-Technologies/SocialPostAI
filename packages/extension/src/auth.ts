import * as vscode from "vscode";

const THREADS_TOKEN_SECRET_KEY = "socialpostai/threadsToken";
const BLUESKY_APP_PASSWORD_SECRET_KEY = "socialpostai/blueskyAppPassword";

export interface ThreadsAuth {
  token: string;
  userId: string;
}

export interface BlueskyAuth {
  handle: string;
  appPassword: string;
}

async function promptForSecret(prompt: string): Promise<string> {
  const value = await vscode.window.showInputBox({
    prompt,
    ignoreFocusOut: true,
    password: true
  });
  if (!value) {
    throw new Error("A value is required to continue.");
  }
  return value.trim();
}

export async function ensureThreadsAuth(context: vscode.ExtensionContext): Promise<ThreadsAuth> {
  const config = vscode.workspace.getConfiguration("socialpostai");
  const configuredToken = config.get<string>("threadsToken");
  const configuredUserId = config.get<string>("threadsUserId");

  const token = (await context.secrets.get(THREADS_TOKEN_SECRET_KEY)) ?? configuredToken;
  const userId = configuredUserId?.trim();

  const finalToken =
    token ??
    (await promptForSecret(
      "Enter Threads access token (will be stored securely and not written to settings)."
    ));

  if (!userId) {
    const input = await vscode.window.showInputBox({
      prompt: "Enter Threads user id (from Threads Graph API)",
      placeHolder: "Your Threads user ID",
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value || !value.trim()) {
          return "Threads user id is required";
        }
        return null;
      }
    });
    if (!input || !input.trim()) {
      throw new Error("Threads user id is required.");
    }
    const trimmedUserId = input.trim();
    await config.update("threadsUserId", trimmedUserId, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Threads user ID saved: ${trimmedUserId}`);
  }

  await context.secrets.store(THREADS_TOKEN_SECRET_KEY, finalToken.trim());

  const resolvedUserId =
    userId ??
    (await vscode.workspace
      .getConfiguration("socialpostai")
      .get<string>("threadsUserId")) ??
    "";

  if (!resolvedUserId) {
    throw new Error("Threads user id is required.");
  }

  return { token: finalToken.trim(), userId: resolvedUserId.trim() };
}

export async function ensureBlueskyAuth(context: vscode.ExtensionContext): Promise<BlueskyAuth> {
  const config = vscode.workspace.getConfiguration("socialpostai");
  let handle = config.get<string>("blueskyHandle")?.trim();
  const secret = await context.secrets.get(BLUESKY_APP_PASSWORD_SECRET_KEY);

  if (!handle) {
    const input = await vscode.window.showInputBox({
      prompt: "Enter your Bluesky handle (e.g., user@domain.com or user.bsky.social)",
      placeHolder: "user@domain.com",
      ignoreFocusOut: true,
      validateInput: (value) => {
        if (!value || !value.trim()) {
          return "Bluesky handle is required";
        }
        if (!value.includes("@") && !value.includes(".")) {
          return "Please enter a valid Bluesky handle (e.g., user@domain.com)";
        }
        return null;
      }
    });

    if (!input || !input.trim()) {
      throw new Error("Bluesky handle is required to continue.");
    }

    handle = input.trim();
    await config.update("blueskyHandle", handle, vscode.ConfigurationTarget.Global);
    vscode.window.showInformationMessage(`Bluesky handle saved: ${handle}`);
  }

  const appPassword =
    secret ??
    (await promptForSecret(
      "Enter Bluesky app password (stored securely in VS Code Secret Storage).\n\nCreate one at: https://bsky.social/settings/app-passwords"
    ));

  await context.secrets.store(BLUESKY_APP_PASSWORD_SECRET_KEY, appPassword);
  return { handle, appPassword };
}

export async function clearSecrets(context: vscode.ExtensionContext) {
  await Promise.all([
    context.secrets.delete(THREADS_TOKEN_SECRET_KEY),
    context.secrets.delete(BLUESKY_APP_PASSWORD_SECRET_KEY)
  ]);
}

import {
  BLUESKY_CHAR_LIMIT,
  BlueskyPayload,
  PreparedPost,
  buildBlueskyPayload
} from "@voxhash/socialpostai-core";

export interface BlueskyRequest {
  kind: "session" | "createRecord";
  url: string;
  method: "POST";
  headers: Record<string, string>;
  body: string;
}

export interface BlueskySession {
  accessJwt: string;
  did: string;
}

export interface BlueskyAdapterOptions {
  handleToDid?: Record<string, string>;
  serviceUrl?: string;
}

export class BlueskyAdapter {
  private handle: string;
  private appPassword: string;
  private options: BlueskyAdapterOptions;
  private serviceUrl: string;

  constructor(handle: string, appPassword: string, options: BlueskyAdapterOptions = {}) {
    if (!handle) throw new Error("Bluesky handle is required");
    if (!appPassword) throw new Error("Bluesky app password is required");
    this.handle = handle;
    this.appPassword = appPassword;
    this.options = options;
    this.serviceUrl = options.serviceUrl ?? "https://bsky.social";
  }

  private buildSessionRequest(): BlueskyRequest {
    return {
      kind: "session",
      url: `${this.serviceUrl}/xrpc/com.atproto.server.createSession`,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        identifier: this.handle,
        password: this.appPassword
      })
    };
  }

  private buildCreateRecordRequest(post: PreparedPost, session: BlueskySession): BlueskyRequest {
    const safeText = post.text.length > BLUESKY_CHAR_LIMIT ? post.text.slice(0, BLUESKY_CHAR_LIMIT) : post.text;
    const payload: BlueskyPayload = buildBlueskyPayload(
      { ...post, text: safeText },
      this.options
    );
    return {
      kind: "createRecord",
      url: `${this.serviceUrl}/xrpc/com.atproto.repo.createRecord`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessJwt}`
      },
      body: JSON.stringify({
        repo: session.did,
        collection: "app.bsky.feed.post",
        record: payload
      })
    };
  }

  prepare(post: PreparedPost) {
    return {
      sessionRequest: this.buildSessionRequest(),
      buildCreateRecordRequest: (session: BlueskySession) =>
        this.buildCreateRecordRequest(post, session)
    };
  }
}

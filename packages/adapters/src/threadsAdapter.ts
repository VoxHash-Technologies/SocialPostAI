import { PreparedPost, ThreadsPayload, buildThreadsPayload } from "@voxhash/socialpostai-core";

export interface ThreadsAdapterOptions {
  userId: string;
  endpoint?: string;
}

export interface ThreadsRequest {
  url: string;
  method: "POST";
  headers: Record<string, string>;
  body: string;
}

export class ThreadsAdapter {
  private token: string;
  private userId: string;
  private endpoint: string;

  constructor(token: string, options: ThreadsAdapterOptions) {
    if (!token) throw new Error("Threads token is required");
    if (!options?.userId) throw new Error("Threads user id is required");
    this.token = token;
    this.userId = options.userId;
    this.endpoint =
      options.endpoint ?? `https://graph.threads.net/v1.0/${this.userId}/threads`;
  }

  prepare(post: PreparedPost, visibility: ThreadsPayload["visibility"] = "PUBLIC"): ThreadsRequest {
    const payload = buildThreadsPayload(post, visibility);
    return {
      url: this.endpoint,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify({ ...payload, access_token: this.token })
    };
  }
}

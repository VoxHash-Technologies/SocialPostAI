import { detectIntent, Intent } from "./intent";
import { Facet, FacetParseOptions, parseFacets } from "./facets";

export interface PreparedPost {
  text: string;
  intent: Intent;
  tone: "professional" | "casual" | "technical" | "launch" | "neutral";
}

export interface ThreadsPayload {
  text: string;
  media_type: "TEXT";
  visibility: "PUBLIC" | "PRIVATE";
}

export interface BlueskyPayload {
  $type: "app.bsky.feed.post";
  text: string;
  createdAt: string;
  facets?: Facet[];
}

export const THREADS_CHAR_LIMIT = 500;
export const BLUESKY_CHAR_LIMIT = 300;

function clamp(text: string, limit: number) {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 1).trimEnd() + "…";
}

function normalize(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function preparePost(
  input: string,
  tone: PreparedPost["tone"] = "neutral"
): PreparedPost {
  const text = normalize(input);
  const intent = detectIntent(text);
  return { text, intent, tone };
}

export function buildThreadsPayload(
  post: PreparedPost,
  visibility: ThreadsPayload["visibility"] = "PUBLIC"
): ThreadsPayload {
  return {
    text: clamp(post.text, THREADS_CHAR_LIMIT),
    media_type: "TEXT",
    visibility
  };
}

export function buildBlueskyPayload(
  post: PreparedPost,
  facetOptions: FacetParseOptions = {}
): BlueskyPayload {
  const facets = parseFacets(post.text, facetOptions);
  return {
    $type: "app.bsky.feed.post",
    text: clamp(post.text, BLUESKY_CHAR_LIMIT),
    createdAt: new Date().toISOString(),
    facets: facets.length ? facets : undefined
  };
}

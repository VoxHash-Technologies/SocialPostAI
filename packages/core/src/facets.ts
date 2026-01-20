export type FacetFeature =
  | { $type: "app.bsky.richtext.facet#link"; uri: string }
  | { $type: "app.bsky.richtext.facet#mention"; did: string };

export interface Facet {
  index: { byteStart: number; byteEnd: number };
  features: FacetFeature[];
}

export interface FacetParseOptions {
  handleToDid?: Record<string, string>;
  /**
   * Maximum number of facets to emit to protect payload size.
   */
  maxFacets?: number;
}

const urlRegex =
  /\bhttps?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{2,63}\b[-a-zA-Z0-9()@:%_+.~#?&//=]*/g;
const mentionRegex = /@([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.[a-z0-9.-]+)/gi;

function toByteIndex(text: string, start: number, end: number) {
  const prefix = text.slice(0, start);
  const segment = text.slice(start, end);
  const byteStart = Buffer.from(prefix, "utf8").length;
  const byteEnd = byteStart + Buffer.from(segment, "utf8").length;
  return { byteStart, byteEnd };
}

function pushFacet(facets: Facet[], facet: Facet, maxFacets: number) {
  if (facets.length >= maxFacets) return;
  const overlaps = facets.some(
    (existing) =>
      (facet.index.byteStart >= existing.index.byteStart &&
        facet.index.byteStart < existing.index.byteEnd) ||
      (facet.index.byteEnd > existing.index.byteStart &&
        facet.index.byteEnd <= existing.index.byteEnd)
  );
  if (!overlaps) {
    facets.push(facet);
  }
}

export function parseFacets(text: string, options: FacetParseOptions = {}): Facet[] {
  const facets: Facet[] = [];
  const maxFacets = options.maxFacets ?? 20;

  if (!text || typeof text !== "string") {
    return facets;
  }

  for (const match of text.matchAll(urlRegex)) {
    const uri = match[0];
    const start = match.index ?? 0;
    const end = start + uri.length;
    const index = toByteIndex(text, start, end);
    pushFacet(
      facets,
      {
        index,
        features: [{ $type: "app.bsky.richtext.facet#link", uri }]
      },
      maxFacets
    );
  }

  for (const match of text.matchAll(mentionRegex)) {
    const handle = match[1].toLowerCase();
    const start = match.index ?? 0;
    const end = start + match[0].length;
    const did = options.handleToDid?.[handle];
    if (!did) {
      continue;
    }
    const index = toByteIndex(text, start, end);
    pushFacet(
      facets,
      {
        index,
        features: did
          ? [{ $type: "app.bsky.richtext.facet#mention", did }]
          : []
      },
      maxFacets
    );
  }

  facets.sort((a, b) => a.index.byteStart - b.index.byteStart);
  return facets;
}

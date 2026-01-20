export type Intent =
  | "announcement"
  | "changelog"
  | "insight"
  | "opinion"
  | "launch"
  | "promotion"
  | "status";

const keywordMap: Record<Intent, RegExp[]> = {
  announcement: [/announce/i, /introduc/i, /available/i],
  changelog: [/changelog/i, /fixed/i, /bug/i, /issue/i, /improv/i],
  insight: [/learned/i, /insight/i, /takeaway/i, /found/i],
  opinion: [/think/i, /believe/i, /should/i],
  launch: [/launch/i, /release/i, /now live/i],
  promotion: [/discount/i, /offer/i, /promo/i, /deal/i],
  status: []
};

export function detectIntent(text: string): Intent {
  const normalized = text.toLowerCase();
  for (const [intent, patterns] of Object.entries(keywordMap) as [
    Intent,
    RegExp[]
  ][]) {
    if (patterns.some((pattern) => pattern.test(normalized))) {
      return intent;
    }
  }
  return "status";
}

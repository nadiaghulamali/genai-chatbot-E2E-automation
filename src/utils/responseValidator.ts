export function normalizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text.replace(/\s+/g, ' ').trim();
}

export function containsAll(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.every(k => lower.includes(k.toLowerCase()));
}

export function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k.toLowerCase()));
}

export function containsForbidden(text: string, forbidden: string[]): boolean {
  const lower = text.toLowerCase();
  return forbidden.some(f => lower.includes(f.toLowerCase()));
}

/**
 * Checks for known "ground truth" snippets to combat hallucination.
 * (This is a simplified check; true anti-hallucination requires external services or large data.)
 */
export function containsGroundTruth(text: string, snippets: string[]): boolean {
  const normalizedText = normalizeText(text);
  // Must contain at least 2 of the critical snippets (e.g., specific agency names)
  let count = 0;
  for (const snippet of snippets) {
    if (normalizedText.includes(normalizeText(snippet))) {
      count++;
    }
  }
  return count >= Math.min(2, snippets.length); 
}

/**
 * Checks for clean formatting (B: Response formatting is clean)
 */
export function checkFormatting(text: string): boolean {
    // 1. Check for incomplete thoughts (trailing '...')
    if (text.trim().endsWith('...')) return false;

    // 2. Simple check for broken/unescaped HTML fragments
    //  the chatbot is not supposed to return raw HTML tags like <div> or <p>
    const brokenHtmlRegex = /<[^>]+(<\s*\w+\s*\/?>|&\w+;)/;
    if (brokenHtmlRegex.test(text)) return false;

    return true;
}

export function containsNone(text: string, list: string[]): boolean {
  return list.every(k => !text.includes(k.toLowerCase()));
}

export function containsLinkHint(text: string, hint: string): boolean {
  return text.includes(hint.toLowerCase());
}

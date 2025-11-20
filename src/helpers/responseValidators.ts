import { expect } from '@playwright/test';
import {
  HappyPathCase,
  SecurityCase,
  FallbackCase
} from '../types/testDataType';

/**
 * Normalizes AI text responses:
 * - trims whitespace
 * - lowercases for comparison
 * - removes newlines
 */
export function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Checks if all required keywords exist in the text.
 * Used for happy_path cases.
 */
export function containsAll(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.every(k => lower.includes(k.toLowerCase()));
}

/**
 * Checks if forbidden values appear.
 * Used for security cases.
 */
export function containsForbidden(text: string, forbidden: string[]): boolean {
  const lower = text.toLowerCase();
  return forbidden.some(f => lower.includes(f.toLowerCase()));
}

/**
 * Performs the standard "happy path" validation.
 * Ensures:
 * - Min response length
 * - Required keywords present
 * - Optional link hint present
 */
export function validateHappyPath(text: string, scenario: HappyPathCase) {
  const normalized = normalizeText(text);

  expect(normalized.length).toBeGreaterThanOrEqual(40);

  for (const kw of scenario.minKeywords) {
    expect(normalized).toContain(kw.toLowerCase());
  }

  if (scenario.mustContainLinkHint) {
    expect(normalized).toContain(scenario.mustContainLinkHint.toLowerCase());
  }
}

/**
 * Validates fallback responses.
 * Ensures expected fallback phrase appears.
 */
export function validateFallback(text: string, scenario: FallbackCase) {
  const normalized = normalizeText(text);

  expect(normalized).toContain(scenario.expectedSubstring.toLowerCase());
}

/**
 * Validates security scenarios.
 * Ensures no forbidden tokens exist.
 */
export function validateSecurity(text: string, scenario: SecurityCase) {
  const normalized = normalizeText(text);

  expect(containsForbidden(normalized, scenario.forbidden)).toBeFalsy();
}

/**
 * HTML sanitation validator:
 * Chatbot must not return raw HTML/script fragments.
 */
export function sanitizedHtmlCheck(html: string) {
  const lower = html.toLowerCase();

  expect(lower).not.toContain('<script');
  expect(lower).not.toContain('</script>');
  expect(lower).not.toContain('javascript:');
}

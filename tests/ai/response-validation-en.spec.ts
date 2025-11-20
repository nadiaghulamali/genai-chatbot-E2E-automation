import { test, expect } from '@playwright/test';
import { UAskChatPage } from '../../src/pages/uaskChatPage';
import { testData } from '../../src/data/testData';
import {
  normalizeText,
  containsAll,
  containsNone,
  containsLinkHint
} from '../../src/utils/responseValidator';

test.describe('UAsk Chatbot GPT-powered response validation (EN)', () => {

  test.beforeEach(async ({ page }) => {
    const chat = new UAskChatPage(page);
    await chat.openChatInEnglishMode();
  });

  // HAPPY PATH TESTS

  for (const scenario of testData.en.happy_path) {
    test(`EN happy path  ${scenario.id}`, async ({ page }) => {
      const chat = new UAskChatPage(page);

      await chat.sendMessage(scenario.prompt);

      const rawText = await chat.getLastAgentMessageText();
      const text = normalizeText(rawText);

      expect(text.length).toBeGreaterThanOrEqual(scenario.minLength);

      await expect
        .poll(() => containsAll(text, scenario.minKeywords))
        .toBeTruthy();

      if (scenario.expectedKeywords?.length) {
        await expect
          .poll(() => containsAll(text, scenario.expectedKeywords))
          .toBeTruthy();
      }

      if (scenario.forbiddenKeywords?.length) {
        await expect
          .poll(() => containsNone(text, scenario.forbiddenKeywords))
          .toBeTruthy();
      }

      if (scenario.mustContainLinkHint) {
        await expect
          .poll(() => containsLinkHint(text, scenario.mustContainLinkHint))
          .toBeTruthy();
      }
    });
  }

  // FALLBACK TESTS

  for (const scenario of testData.en.fallback) {
    test(`EN fallback  ${scenario.id}`, async ({ page }) => {
      const chat = new UAskChatPage(page);

      await chat.sendMessage(scenario.prompt);

      const answer = normalizeText(await chat.getLastAgentMessageText());

      expect(answer.toLowerCase()).toContain(
        scenario.expectedSubstring.toLowerCase()
      );
    });
  }

  // SECURITY TESTS

  for (const scenario of testData.en.security) {
    test(`EN security  ${scenario.id}`, async ({ page }) => {
      const chat = new UAskChatPage(page);

      await chat.sendMessage(scenario.prompt);

      const answer = normalizeText(await chat.getLastAgentMessageText());

      await expect
        .poll(() => containsNone(answer, scenario.forbidden))
        .toBeTruthy();
    });
  }
});

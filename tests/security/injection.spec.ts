import { test, expect } from '@playwright/test';
import { testData } from '../../src/data/testData';
import { normalizeText, containsForbidden } from '../../src/utils/responseValidator';
import { UAskChatPage } from '../../src/pages/uaskChatPage';
import { SecurityCase } from '../../src/types/testDataType';

const securityCases: SecurityCase[] = testData.en.security ?? [];

test.describe('UAsk Chatbot Security & prompt injection handling', () => {
  for (const scenario of securityCases) {
    test(`Security ${scenario.id}`, async ({ page }) => {
      const chat = new UAskChatPage(page);
      await chat.openChatInEnglishMode();

      await chat.sendMessage(scenario.prompt);
      const answer = normalizeText(await chat.getLastAgentMessageText());

      expect(answer.length).toBeGreaterThan(0);
      expect(containsForbidden(answer, scenario.forbidden)).toBeFalsy();
    });
  }
});

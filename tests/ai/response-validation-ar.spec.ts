import { test, expect } from '@playwright/test';
import { UAskChatPage } from '../../src/pages/uaskChatPage';
import { testData } from '../../src/data/testDataAr';
import { normalizeText, containsAll } from '../../src/utils/responseValidator';

const data = testData.ar;

test.describe('UAsk Chatbot GPT-powered response validation (AR)', () => {

    // Arabic Happy Path

    for (const scenario of data.happy_path) {
        test(`AR happy path  ${scenario.id}`, async ({ page }) => {
            const chat = new UAskChatPage(page);

            await chat.openChatInArabichMode();

            const before = await chat.agentMessages.count();
            await chat.sendMessage(scenario.prompt);
            await chat.waitForNextAgentMessage(before);

            const answer = normalizeText(await chat.getLastAgentMessageText());

            expect(answer.length).toBeGreaterThan(20);

            const ok = containsAll(answer, scenario.minKeywords);
            expect(ok).toBeTruthy();
        });
    }

    // Arabic Fallback Cases

    for (const scenario of data.fallback) {
        test(`AR fallback ${scenario.id}`, async ({ page }) => {
            const chat = new UAskChatPage(page);

            await chat.openChatInArabichMode();

            await chat.sendMessage(scenario.prompt);
            const answer = normalizeText(await chat.getLastAgentMessageText());

            expect(answer.toLowerCase()).toContain(
                scenario.expectedSubstring.toLowerCase()
            );
        });
    }

    // Arabic Security Cases

    for (const scenario of data.security) {
        test(`AR security ${scenario.id}`, async ({ page }) => {
            const chat = new UAskChatPage(page);

            await chat.openChatInArabichMode();

            await chat.sendMessage(scenario.prompt);

            const answer = normalizeText(await chat.getLastAgentMessageText());

            for (const forbidden of scenario.forbidden) {
                expect(answer.toLowerCase()).not.toContain(forbidden.toLowerCase());
            }
        });
    }
});

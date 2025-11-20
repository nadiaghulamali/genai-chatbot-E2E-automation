import { test, expect } from '@playwright/test';
import { UAskChatPage } from '../../src/pages/uaskChatPage';

test.describe('UAsk Chatbot UI Arabic', () => {

    test.beforeEach(async ({ page }) => {
        const chat = new UAskChatPage(page);
        await chat.openChatInArabichMode();
    });

    test('Arabic chat loads and returns a response', async ({ page }) => {
        const chat = new UAskChatPage(page);

        const before = await chat.agentMessages.count();
        await chat.sendMessage('مرحبا');

        await chat.waitForNextAgentMessage(before);

        const reply = await chat.getLastAgentMessageText();
        expect(reply.length).toBeGreaterThan(0);
    });

    test('Input field is cleared after sending a message (Arabic)', async ({ page }) => {
        const chat = new UAskChatPage(page);

        const before = await chat.agentMessages.count();
        await chat.sendMessage('اختبار الحقل');

        await chat.waitForNextAgentMessage(before);

        const value = await chat.chatInput.inputValue();
        expect(value).toBe('');
    });

    test('Arabic chat container exposes listbox roles', async ({ page }) => {
        const chat = new UAskChatPage(page);

        await chat.sendMessage("مرحبا");

        const options = page.locator('[role="option"]');
        await expect(options.first()).toBeVisible({ timeout: 20000 });
    });

});

import { test, expect } from '@playwright/test';
import { UAskChatPage } from '../../src/pages/uaskChatPage';

test.describe('UAsk Chatbot English UI & Basic Flow', () => {

  test.beforeEach(async ({ page }) => {
    const chat = new UAskChatPage(page);
    await chat.openChatInEnglishMode();  // Handles disclaimer + captcha
  });

  test('chat widget loads, user can send message, bot responds', async ({ page }) => {
    const chat = new UAskChatPage(page);

    await expect(page.locator('h5.message-title[role="heading"]')).toHaveCount(1);


    const before = await chat.getAgentMessageCount();

    await chat.sendMessage('Hello');

    await chat.waitForNextAgentMessage(before);

    const reply = await chat.getLastAgentMessageText();
    expect(reply.length).toBeGreaterThan(0);
  });

  // Input is cleared after sending a message

  test('input is cleared after sending message', async ({ page }) => {
    const chat = new UAskChatPage(page);

    const before = await chat.getAgentMessageCount();

    await chat.sendMessage('Testing input clear');

    await chat.waitForNextAgentMessage(before);

    const currentValue = await chat.chatInput.inputValue();
    expect(currentValue).toBe('');
  });

  // Accessibility attributes: role=listbox & options exist


  test('chat container has correct accessibility roles', async ({ page }) => {
    const chat = new UAskChatPage(page);

    await expect(chat.chatContainer).toHaveAttribute('role', 'listbox');

    const options = page.locator('.chatContainer [role="option"], [aria-label="Messages"] [role="option"]');

    await expect(options.count()).resolves.toBeGreaterThan(0);

  });
});

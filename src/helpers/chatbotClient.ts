import { Page, Locator, expect } from "@playwright/test";

export class ChatbotClient {
  private page: Page;

  private input: Locator;
  private sendBtn: Locator;

  private botMessages: Locator;
  private userMessages: Locator;
  private loader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.input = page.locator('#conversation');

    this.sendBtn = page.locator('button.send-question');

    this.botMessages = page.locator(
      '.agent-message, .agent-markdown, div[role="option"][dir], div[role="option"]'
    );

    this.userMessages = page.locator('.user-message, div[role="option"]:not([dir])');

    this.loader = page.locator('.typing-loader, .loading, [aria-label="Loading"]');
  }

  /**
   * Sends a message in the chatbot input
   */
  async sendMessage(text: string) {
    await this.input.fill(text);
    await expect(this.sendBtn).toBeEnabled({ timeout: 8000 });
    await this.sendBtn.click({ force: true });
  }

  /**
   * Waits for AI response and returns its text
   */
  async getLatestAIResponse(): Promise<string> {
    // Wait for loader (if it exists)
    await this.loader.first().waitFor({ state: "hidden", timeout: 8000 }).catch(() => {});

    const count = await this.botMessages.count();
    if (count === 0) {
      throw new Error("No AI messages were found.");
    }

    const lastMsg = this.botMessages.nth(count - 1);
    await expect(lastMsg).toBeVisible({ timeout: 15000 });

    return (await lastMsg.textContent())?.trim() || "";
  }

  /**
   * Gets the last user message HTML
   */
  async getLatestUserMessageHTML(): Promise<string> {
    const count = await this.userMessages.count();
    if (count === 0) return "";

    const lastUser = this.userMessages.nth(count - 1);
    await expect(lastUser).toBeVisible();

    return await lastUser.innerHTML();
  }

  /**
   * Combined helper: send message + return bot reply
   */
  async ask(text: string): Promise<string> {
    await this.sendMessage(text);
    return await this.getLatestAIResponse();
  }
}

import { Page, Locator, expect } from '@playwright/test';
import { DisclaimerModal } from '../components/disclaimerModal';
import { CaptchaGuard } from '../components/CaptchaGuard';

export class UAskChatPage {
    readonly page: Page;

    readonly disclaimer: DisclaimerModal;
    readonly captcha: CaptchaGuard;

    chatContainer: Locator;
    chatInput: Locator;
    sendButton: Locator;
    agentMessages: Locator;

    constructor(page: Page) {
        this.page = page;

        this.disclaimer = new DisclaimerModal(page);
        this.captcha = new CaptchaGuard(page);

        this.chatContainer = page.locator(
            '.chatContainer[role="listbox"], [aria-label="Messages"][role="listbox"]'
        );

        this.chatInput = page.locator('#conversation');

        this.sendButton = page.locator('button.send-question');

        this.agentMessages = page.locator(
            '.agent-message, .agent-markdown, div[role="option"]'
        );

        const title = page.locator('h5.message-title[role="heading"]');

    }


    async openChatInEnglishMode() {
        await this.page.goto('https://beta-ask.u.ae/en/uask', {
            waitUntil: 'domcontentloaded'
        });

        await this.disclaimer.acceptIfVisible();
        await this.captcha.skipIfCaptchaAppearsWithin(12000);

        await expect(this.page.locator('h5.message-title[role="heading"]')).toHaveCount(1);

    }

    async openChatInArabichMode() {
        await this.page.goto('https://beta-ask.u.ae/ar/uask', {
            waitUntil: 'domcontentloaded'
        });

        await this.disclaimer.acceptIfVisible();
        await this.captcha.skipIfCaptchaAppearsWithin(12000);


        await expect(this.page.locator('h5.message-title[role="heading"]')).toHaveCount(1);

    }

    async sendMessage(message: string) {
        await this.chatInput.fill(message);
        const trimmed = message.trim();

        // Empty input fallback: button SHOULD stay disabled
        if (!trimmed) {
            await expect(this.sendButton).toBeDisabled();
            return;
        }

        // Normal flow
        await this.sendButton.waitFor({ state: 'visible', timeout: 8000 });
        await expect(this.sendButton).toBeVisible();
        await expect(this.sendButton).toBeEnabled({ timeout: 10000 });

        await this.sendButton.click();

        // 🔹 After sending, give CAPTCHA a chance to appear
        await this.captcha.skipIfCaptchaAppearsWithin(12000);
    }

    async getLastAgentMessageText(): Promise<string> {
        await this.captcha.skipIfCaptchaAppearsWithin(12000);

        // Wait until at least one agent message exists
        await this.page.waitForFunction(() => {
            const msgs = document.querySelectorAll(
                '.agent-message, .agent-markdown, div[role="option"][dir], div[role="option"]'
            );
            return msgs.length > 0;
        }, { timeout: 30000 });

        await this.captcha.skipIfCaptchaAppearsWithin(12000);


        await this.page.waitForFunction(() => {
            const msgs = document.querySelectorAll(
                '.agent-message, .agent-markdown, div[role="option"][dir], div[role="option"]'
            );
            if (msgs.length === 0) return false;

            const last = msgs[msgs.length - 1];

            const text = (last.textContent || '').trim();

            return text.length > 20;
        }, { timeout: 45000 });


        const count = await this.agentMessages.count();
        return (await this.agentMessages.nth(count - 1).innerText()).trim();
    }


    async waitForNextAgentMessage(previousCount: number) {
        await this.page.waitForFunction(
            ({ selector, oldCount }) => {
                const nodes = document.querySelectorAll(selector);
                return nodes.length > oldCount;
            },
            {
                selector: '.agent-message, .agent-markdown, div[role="option"]',
                oldCount: previousCount
            },
            { timeout: 40000 }
        );
    }


    async getAgentMessageCount(): Promise<number> {
        return await this.agentMessages.count();
    }
}

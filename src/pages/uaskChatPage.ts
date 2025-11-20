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
        await this.captcha.failIfPresent();

        await expect(this.page.locator('h5.message-title[role="heading"]')).toHaveCount(1);

    }

    async openChatInArabichMode() {
        await this.page.goto('https://beta-ask.u.ae/ar/uask', {
            waitUntil: 'domcontentloaded'
        });

        await this.disclaimer.acceptIfVisible();
        await this.captcha.failIfPresent();


        await expect(this.page.locator('h5.message-title[role="heading"]')).toHaveCount(1);

    }





    async sendMessage(message: string) {
        // Ensure no modal or captcha blocks the UI

        await this.chatInput.click({ force: true });
        await this.chatInput.fill(message);

        await expect(this.sendButton).toBeEnabled({ timeout: 10000 });
        await this.sendButton.click({ force: true });
        await this.captcha.failIfPresent();
    }


    // Agent message retrieval


    async getLastAgentMessageText(): Promise<string> {
        await this.captcha.failIfPresent();

        // Wait until at least one agent message exists
        await this.page.waitForFunction(() => {
            const msgs = document.querySelectorAll(
                '.agent-message, .agent-markdown, div[role="option"][dir], div[role="option"]'
            );
            return msgs.length > 0;
        }, { timeout: 30000 });

        await this.captcha.failIfPresent();


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



    // Wait for next agent message


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


    // Get total agent messages


    async getAgentMessageCount(): Promise<number> {
        return await this.agentMessages.count();
    }
}

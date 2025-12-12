import { Locator, Page } from '@playwright/test';

export class CaptchaGuard {
  private readonly captcha: Locator;

  constructor(private readonly page: Page) {
    this.captcha = page.locator('iframe[src*="recaptcha"], .captcha-container');
  }

  /**
   * Instant snapshot check – no waiting.
   * Returns true if any CAPTCHA element is visible *right now*.
   */
  async isPresentNow(): Promise<boolean> {
    try {
      return await this.captcha.first().isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Waits up to `timeoutMs` to see if CAPTCHA becomes visible.
   * Returns true if it appears within that window, false otherwise.
   */
  async appearsWithin(timeoutMs = 8000): Promise<boolean> {
    try {
      await this.captcha.first().waitFor({ state: 'visible', timeout: timeoutMs });
      return true;  // appeared
    } catch {
      return false; // did not appear in that window
    }
  }

  /**
   *  fail immediately if CAPTCHA already visible.
   * 
   */
  async failIfPresentNow() {
    if (await this.isPresentNow()) {
      throw new Error(
        'CAPTCHA detected: Automation cannot continue. ' +
        'Disable CAPTCHA for test environments.'
      );
    }
  }

  /**
   * Preferred: fail if CAPTCHA appears within some time AFTER an action 
   */
  async skipIfCaptchaAppearsWithin(testInfo: any, timeoutMs = 8000) {
    const appeared = await this.appearsWithin(timeoutMs);

    if (appeared) {
      testInfo.skip(
        `CAPTCHA appeared within ${timeoutMs}ms → skipping this test.`
      );
    }
  }

}

import { Page, Locator } from '@playwright/test';

export class CaptchaGuard {
  private page: Page;

  private iframe: Locator;
  private iframeContentLocator: Locator; 

  constructor(page: Page) {
    this.page = page;

    //  Locate the reCAPTCHA iframe
    this.iframe = page.locator('iframe[src*="recaptcha"]').first();

    this.iframeContentLocator = this.iframe
      .frameLocator(':scope')
      .locator('#recaptcha-anchor');
  }

  // Detect CAPTCHA presence 
 
  async isPresent(): Promise<boolean> {
    try {
      // Step 1: Check if the iframe itself is attached to the DOM
      if (!(await this.iframe.isVisible())) {
        return false;
      }

      // Step 2: Check if the checkbox element inside the iframe is visible
      // This is the most reliable check. Use waitFor() for up to 1 second
      // instead of isVisible() alone to handle brief rendering delays.
      await this.iframeContentLocator.waitFor({ state: 'visible', timeout: 1000 });
      return true;

    } catch (e) {
      // If waitFor fails (times out), the element is not present/visible, so return false.
      return false;
    }
  }

  // Throw an error if CAPTCHA is detected
  async failIfPresent() {
    if (await this.isPresent()) {
      throw new Error(
        'CAPTCHA detected: Automation cannot continue. ' +
        'Disable CAPTCHA for test environments.'
      );
    }
  }
}

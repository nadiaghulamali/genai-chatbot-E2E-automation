import { Page, Locator } from '@playwright/test';

export class DisclaimerModal {
  private page: Page;

  private modalWindow: Locator;
  private acceptButton: Locator;
  private loader: Locator;

  constructor(page: Page) {
    this.page = page;

    // Official modal selector
    this.modalWindow = page.locator('ngb-modal-window.fade.show');

    // Buttons
    this.acceptButton = page.locator('button[aria-label="Accept and continue"], button[aria-label="قبول ومتابعة"]');

    // Loader overlay
    this.loader = page.locator('.block-ui-wrapper.block-ui-main.active');
  }

  // Wait for loader to finish 

  private async waitForLoaderToDisappear() {
    await this.loader.waitFor({
      state: 'hidden',
      timeout: 8000
    }).catch(() => {});
  }

  // Check if modal appears 

  async appearsWithin(timeoutMs = 12000): Promise<boolean> {
    try {
      await this.modalWindow.waitFor({
        state: 'visible',
        timeout: timeoutMs
      });
      return true;
    } catch {
      return false;
    }
  }

  // Accept the modal when ready

  async acceptIfVisible() {
    await this.waitForLoaderToDisappear();

    // Modal appears slowly 
    const shown = await this.appearsWithin(12000);
    if (!shown) return; // if Modal does not exist for this session

    await this.acceptButton.click({ force: true }).catch(() => {});
    await this.modalWindow.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
  }
}

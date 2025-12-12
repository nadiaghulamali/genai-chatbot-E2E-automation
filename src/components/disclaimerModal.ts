import { Page, Locator } from '@playwright/test';

export class DisclaimerModal {
  private page: Page;

  private modalWindow: Locator;
  private acceptButton: Locator;
  private loader: Locator;
  private disclaimerDialog: Locator;

  constructor(page: Page) {
    this.page = page;

    this.modalWindow = page.locator('ngb-modal-window.fade.show');

    // Match either "Disclaimer" or anything starting with "إخلاء" for AR
    this.disclaimerDialog = page.getByRole('dialog', {
      name: /Disclaimer|إخلاء/i,
    });

    this.acceptButton = this.disclaimerDialog.getByRole('button', {
      name: /Accept and continue|قبول|متابعة/i,
    });




    // Loader overlay
    this.loader = page.locator('.block-ui-wrapper.block-ui-main.active');
  }

  // Wait for loader to finish 

  private async waitForLoaderToDisappear() {
    await this.loader.waitFor({
      state: 'hidden',
      timeout: 8000
    }).catch(() => { });
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
    const shown = await this.appearsWithin(12000);
    if (!shown) return; // no modal in this session – nothing to do

    await this.modalWindow.waitFor({ state: 'visible', timeout: 8000 });

    await this.acceptButton.waitFor({ state: 'visible', timeout: 8000 });
    await this.page.waitForTimeout(20000);

    await this.acceptButton.click();

    //  Wait for modal to disappear 
    await this.modalWindow.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => { /* ignore if it sticks */ });
  }
}

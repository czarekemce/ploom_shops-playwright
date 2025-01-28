import {test, Page, Locator, expect} from '@playwright/test'

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
      this.page = page;
    };

    // Go to url and wait for the page to load
    async goToUrl(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    };

    // If cookies banner is visible - reject cookies
    async rejectCookiesIfVisible() {
        const cookiesHandle = await this.page.locator('#onetrust-banner-sdk').elementHandle();
        if (cookiesHandle){
            await this.page.locator('#onetrust-reject-all-handler').click();
            await this.page.waitForLoadState('domcontentloaded');
        };
    };

    // Confirm age in modal
    async confirmAgeModal() {
        this.page.on('dialog', dialog => dialog.accept());
        await this.page.locator('.ageconfirmation__confirmBtn > .aem-button__link').getByTestId('customButton').click();
    };
};
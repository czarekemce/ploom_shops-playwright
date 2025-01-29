import {Page, Locator} from '@playwright/test'

export class BasePage {
    readonly page: Page;
    readonly cookiesBanner: Locator;
    readonly rejectCookiesButton: Locator;
    readonly ageConfirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cookiesBanner = page.locator('#onetrust-banner-sdk');
        this.rejectCookiesButton = page.locator('#onetrust-reject-all-handler');
        this.ageConfirmButton = page.locator('.ageconfirmation__confirmBtn > .aem-button__link').getByTestId('customButton');
    };

    async goToUrl(url: string) {
        await this.page.goto(url);
        await this.page.waitForLoadState('domcontentloaded');
    };

    async rejectCookiesIfVisible() {
        if (await this.cookiesBanner.elementHandle()) {
            await this.rejectCookiesButton.click();
            await this.page.waitForLoadState('domcontentloaded');
        };
    };

    async confirmAgeModal() {
        this.page.on('dialog', dialog => dialog.accept());
        await this.ageConfirmButton.click();
    };
};

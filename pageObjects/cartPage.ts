import {Page, Locator} from '@playwright/test'

export class CartPage {
    readonly page: Page;
    readonly miniCartCheckoutButton: Locator;
    readonly cartRemoveButton: Locator;
    readonly removeItemConfirmButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.miniCartCheckoutButton = page.getByTestId('miniCartCheckoutButton');
        this.cartRemoveButton = page.getByTestId('regular-cart-list').getByTestId('cartRemoveButton');
        this.removeItemConfirmButton = page.getByTestId('remove-item-submit-button');
    };

    async goToBasket() {
        await this.miniCartCheckoutButton.click();
    };

    async removeItemFromCart() {
        await this.cartRemoveButton.click();
        this.page.on('dialog', dialog => dialog.accept());
        await this.removeItemConfirmButton.click();
    };
};

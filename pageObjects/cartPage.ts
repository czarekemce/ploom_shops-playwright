import {Page} from '@playwright/test'

export class CartPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
      };

    // Go to the basket
    async goToBasket() {
        await this.page.getByTestId('miniCartCheckoutButton').click();
    };

    // Remove items from the cart
    async removeItemFromCart() {
        await this.page.getByTestId('regular-cart-list').getByTestId('cartRemoveButton').click();

        this.page.on('dialog', dialog => dialog.accept());
        await this.page.getByTestId('remove-item-submit-button').click();
    };
};
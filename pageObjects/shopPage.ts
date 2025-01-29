import {Page, expect, Locator} from '@playwright/test'

export class ShopPage {
    readonly page: Page;
    readonly shopButton: Locator;
    readonly addToCartButton: Locator;
    readonly miniCart: Locator;
    readonly miniCartItemCount: Locator;
    
    allLinksValid: boolean;
    allImagesLoaded: boolean;

    constructor(page: Page) {
        this.page = page;
        this.shopButton = page.locator('.navigation__link').getByText(/Sklep|Shop/i);
        this.addToCartButton = page.getByTestId('pdpAddToProduct');
        this.miniCart = page.getByTestId('mini-cart-header');
        this.miniCartItemCount = this.miniCart.locator('.mini-cart__header > div').nth(1);
    };

    async goToProduct(skuValue: string) {
        await this.shopButton.click();
        await this.page.waitForLoadState('load');

        const productButton = this.page.locator(`[data-sku="${skuValue}"]`);
        await productButton.click({ force: true });
        await this.page.waitForLoadState('load');
    };

    async addProductToBasket() {
        await this.addToCartButton.click();
        await this.page.waitForLoadState('load');
        await this.page.waitForTimeout(5000);
    };

    async checkBasketCount() {
        const newItem = await this.miniCartItemCount.textContent();
        const isInBasket = newItem?.includes('1');

        console.log(isInBasket ? 'Product is in the basket' : 'No products in the basket');
        return isInBasket;
    };

    async checkAllLinks() {
        const links = await this.page.locator('a').all();
        this.allLinksValid = true;

        for (const link of links) {
            const href = await link.getAttribute('href');

            if (!href || !(href.startsWith('http://') || href.startsWith('https://'))) {
                continue;
            };

            if (href.includes('google')) {
                console.log('Google requires cookies - skip');
                continue;
            };

            try {
                const response = await this.page.goto(href, { waitUntil: 'load', timeout: 5000 });

                if (response) {
                    console.log(`Link: ${href} returned status: ${response.status()}`);
                    expect(response.status()).toBe(200);
                } else {
                    console.log(`Link: ${href} returned no response`);
                    this.allLinksValid = false;
                };
            } catch (error) {
                console.log(`Error or timeout for link: ${href} - ${error.message}`);
                this.allLinksValid = false;
            };
        };
    };

    async checkAllImages() {
        const images = this.page.locator('img'); 
        const imageElements = await images.all(); 
        this.allImagesLoaded = true;

        const imagePromises = imageElements.map(async (image) => {
            const imageUrl = await image.getAttribute('src');

            try {
                await Promise.race([
                    image.waitFor({ state: 'attached' }),
                ]);

                console.log(`Image ${imageUrl} loaded correctly`);
            } catch (error) {
                console.log(`Image loading error ${imageUrl}: ${error.message}`);
                this.allImagesLoaded = false;
            };
        });

        await Promise.all(imagePromises);
    };
};

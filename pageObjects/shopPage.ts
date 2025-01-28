import {Page, expect} from '@playwright/test'

export class ShopPage {
    readonly page: Page;
            allLinksValid: boolean;
            allImagesLoaded: boolean;

    constructor(page: Page) {
        this.page = page;
      }

    // Go to shop grid and click in product
    async goToProduct(skuValue) {
        const shopButton = this.page.locator('.navigation__link').getByText(/Sklep|Shop/i);
        await shopButton.click()
        await this.page.waitForLoadState('load')

        const button = this.page.locator(`[data-sku="${skuValue}"]`)

        await button.click({ force: true})
        await this.page.waitForLoadState('load')
    };

    // Add product to basket and wait for state
    async addProductToBasket() {
        await this.page.getByTestId('pdpAddToProduct').click()        
        await this.page.waitForLoadState('load')
        await this.page.waitForTimeout(5000)
    };

    // Check number of products in basket and return correct value
    async checkBasketCount() {
        const miniCart = await this.page.getByTestId('mini-cart-header');
        const newItem = await miniCart.locator('.mini-cart__header > div').nth(1).textContent();

        if (newItem?.includes('1')) {
            console.log('Product is in the basket')
            return true;
        } else {
            console.log('No products in the basket');
            return false;
        };
    };

    // Check all links in product endpoint and if the conditions are met return correct value
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
                    // optional logs
                    console.log(`Link: ${href} returned status: ${response.status()}`);
                    expect(response.status()).toBe(200);
                } else {
                    // optional logs
                    console.log(`Link: ${href} returned no response`);
                    this.allLinksValid = false;
                };
    
            } catch (error) {
                console.log(`Error or timeout for link: ${href} - ${error.message}`);
                this.allLinksValid = false;
            };
        };
    };

    // Check all images in product endpoint and if the conditions are met return correct value
    async checkAllImages() {
        const images = this.page.locator('img'); 
        const imageElements = await images.all(); 
        this.allImagesLoaded = true

        const imagePromises = imageElements.map(async (image) => {
            const imageUrl = await image.getAttribute('src');

            try {
                await Promise.race([
                    image.waitFor({ state: 'attached' }),
            ]);

            console.log(`Image ${imageUrl} loaded correctly`);
            } catch (error) {
                console.log(`Image loading error ${imageUrl}: ${error.message}`);
                this.allImagesLoaded = false
            };
        });
        await Promise.all(imagePromises);
    };
};
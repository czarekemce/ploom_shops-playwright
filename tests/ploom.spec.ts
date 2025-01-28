import { test, expect } from '@playwright/test';
import { BasePage } from '../pageObjects/basePage';
import { ShopPage } from '../pageObjects/shopPage';
import { CartPage } from '../pageObjects/cartPage';

test.describe('Ploom websites tests', () => {
  const urls = [
    'https://www.ploom.co.uk/en', // English web
    'https://www.ploom.pl/pl',    // Polish web
  ];

  const skuParams = [
    ['ploom-x-advanced', 'PLOOM-X-ESSENTIAL-BUNDLE'], // English SKU
    ['16199177', '16154414']                         // Polish SKU
  ];

  // Iterating through all language versions (en, pl)
  for (let i = 0; i < urls.length; i++) {
    test.describe(`Tests for ${urls[i]}`, () => {
      
      test.beforeEach(async ({ page }) => {
        const basePage = new BasePage(page);

        await basePage.goToUrl(urls[i]);
        await basePage.rejectCookiesIfVisible();
        await basePage.confirmAgeModal();
      });

      test('Verify if it is possible to add a product to the cart.', async ({ page }) => {
        const shopPage = new ShopPage(page);

        await shopPage.goToProduct(skuParams[i][0]);
        await shopPage.addProductToBasket();
        await shopPage.checkBasketCount();

        // Expect to have 1 item in the basket
        expect(await shopPage.page.getByTestId('mini-cart-header').locator('.mini-cart__header > div').nth(1).textContent()).toContain('1')
      });

      test('Verify if it is possible to remove a product from the cart.', async ({ page }) => {
        const cartPage = new CartPage(page);
        const shopPage = new ShopPage(page);

        await shopPage.goToProduct(skuParams[i][1]);
        await shopPage.addProductToBasket();

        await cartPage.goToBasket();
        await cartPage.removeItemFromCart();

        // Expect that 'remove item' button is no longer visible - this means that there is no item in the cart
        expect(page.getByTestId('remove-item-submit-button')).not.toBeVisible();

        // Reload the page to update the cart
        await page.reload();

        const basketCount = await shopPage.checkBasketCount();

        // Expect that there is no item in the basket
        expect(basketCount).toBeFalsy();
      });

      test('Verify if there are any broken links or images on the product page.', async ({ page }) => {
        const shopPage = new ShopPage(page);

        await shopPage.goToProduct(skuParams[i][0]);

        await shopPage.checkAllLinks();

        // Expect that all links are valid
        expect(shopPage.allLinksValid).toBe(true);

        await shopPage.checkAllImages();

        // Expect that all images are valid
        expect(shopPage.allImagesLoaded).toBe(true);
      });

    });
  };
});

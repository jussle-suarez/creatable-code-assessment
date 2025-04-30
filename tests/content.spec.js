import { test, expect } from '@playwright/test';
const ContentPage = require('./../pages/content.page.js');

let contentPage, countFromContentPage, countFromContentDetailsPage, productCountContentPage;

test.beforeEach(async ({ page }) => {
    contentPage = new ContentPage(page);
    await page.goto('/');
    await contentPage.login();
    await contentPage.navigateToContentPage();
})

test('[TC1] Verify key elements in Content page are visible', async ({ page }) => {
    await expect(page).toHaveURL('https://creators.creatable.io/5a018367/content');
    await expect(contentPage.contentHeader).toBeVisible();
    await expect(contentPage.searchField).toBeVisible();
    await expect(contentPage.campaignModerationWorkflow).toBeVisible();
    await expect(contentPage.creatorSearchAndBook).toBeVisible();
    await expect(contentPage.imageAsset).toBeVisible();
    await expect(contentPage.productImage).toBeVisible();
});

test('[TC2] Verify Search feature works as expected', async ({ page }) => {
    await test.step('User search for valid data', async () => {
        await contentPage.searchData('Campaign moderation workflow');
        await expect(contentPage.campaignModerationWorkflow).toBeVisible();
    });
    await test.step('User search for invalid data', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Non Existing Data');
        await expect(contentPage.campaignModerationWorkflow).toBeHidden();
        await expect(contentPage.creatorSearchAndBook).toBeHidden();
        await expect(contentPage.imageAsset).toBeHidden();
        await expect(contentPage.productImage).toBeHidden();
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
});

test('[TC3] Verify Key Elements of content details are displayed', async ({ page }) => {
    await contentPage.campaignModerationWorkflow.click();
    await test.step('Verify key elements are displayed', async () => {
        await expect(contentPage.contentDetailsStatus).toBeVisible();
        await expect(contentPage.deleteButton).toBeVisible();
        await expect(contentPage.submitForReviewButton).toBeVisible();
        await expect(contentPage.shareButton).toBeVisible();
        await expect(contentPage.titleField).toBeVisible();
        await expect(contentPage.shareButton).toBeVisible();
        await expect(contentPage.captionField).toBeVisible();
        await expect(contentPage.matchButton).toBeVisible();
        await expect(contentPage.copyAllButton).toBeVisible();
        await expect(contentPage.cancelButton).toBeVisible();
        await expect(contentPage.saveButton).toBeVisible();
    });
});

test('[TC4] Verify Product count from Content page and Content details are equal.', async ({ page }) => {
    // Pass product count displayed in Content page 
    productCountContentPage = page.getByTestId('content-239485319').getByRole('button');
    countFromContentPage = await contentPage.getProductCountInContentPage(productCountContentPage);

    await contentPage.productImage.click();
    countFromContentDetailsPage = await contentPage.getProductCountInContentDetailsPage();

    await test.step('Compare count from content page is equal to content details page', async () => {
        await expect(countFromContentPage).toBe(countFromContentDetailsPage);
    });
});

test('[TC5] Verify Content Title is updated after updating via Content Details page', async ({ page }) => {
    await contentPage.productImage.click();
    await test.step('Update content title', async () => {
        await contentPage.titleField.clear();
        await contentPage.titleField.fill('Product image - v2');
        await contentPage.saveButton.click();
    });
    await test.step('Verify Content title is updated', async () => {
        await contentPage.searchData('Product image - v2');
        const title = page.getByTestId('content-239485319');
        const contentTitle = await contentPage.getContentTitle(title);
        await expect(contentTitle).toBe('Product image - v2');
    });
});

test('[TC6] Verify Content Product counts is updated after adding more product.', async ({ page }) => {
    await contentPage.productImage.click();
    await test.step('Add more product', async () => {
        countFromContentDetailsPage = await contentPage.getProductCountInContentDetailsPage();
        await contentPage.matchButton.click();
        await contentPage.addProduct('Schluter Kerdi-Drain 4in. Grate Matte White Pure');
        await contentPage.addProduct('Schluter Shelf Triangular Corner Floral Bronze')
        countFromContentDetailsPage = Number(countFromContentDetailsPage) + 2;
    });
    await test.step('Verify Content Product count is updated', async () => {
        await page.goto('/');
        await contentPage.navigateToContentPage();
        productCountContentPage = page.getByTestId('content-239485319').getByRole('button');
        countFromContentPage = await contentPage.getProductCountInContentPage(productCountContentPage);
        await expect(countFromContentDetailsPage).toBe(Number(countFromContentPage));
    });
    await test.step('Revert Product Image Count', async () => {
        await page.goto('/');
        await contentPage.navigateToContentPage();
        await contentPage.productImage.click();
        await contentPage.matchButton.click();
        await contentPage.removeProduct('Schluter Kerdi-Drain 4in. Grate Matte White Pure');
        await contentPage.removeProduct('Schluter Shelf Triangular Corner Floral Bronze')
    });
});

test('[TC7] Verify Share button works as expected.', async ({ page }) => {
    await contentPage.productImage.click();
    await contentPage.shareButton.click();
    await test.step('Verify Share Content modal shows on click of Share button', async () => {
        await expect(contentPage.shareContentHeader).toBeVisible();
        await expect(contentPage.shareContentModal).toBeVisible();
        await expect(contentPage.instagramMenu).toBeVisible();
        await expect(contentPage.twitterMenu).toBeVisible();
        await expect(contentPage.linkedinMenu).toBeVisible();
        await expect(contentPage.threadsMenu).toBeVisible();
        await expect(contentPage.pinterestMenu).toBeVisible();
        await expect(contentPage.facebookMenu).toBeVisible();
    });
});

test.afterEach(async ({ page }) => {
    await page.goto('/');
    await contentPage.navigateToContentPage();
    await test.step('Revert Product Image Title', async () => {
        const title = page.getByTestId('content-239485319');
        await contentPage.clickContentTitleBasedOnTestId(title);
        await contentPage.titleField.clear();
        await contentPage.titleField.fill('Product image');
        await contentPage.saveButton.click();
    });
    await test.step('Verify Content title is reverted', async () => {
        await contentPage.searchData('Product image');
        const title = page.getByTestId('content-239485319');
        const contentTitle = await contentPage.getContentTitle(title);
        await expect(contentTitle).toBe('Product image');
    });
})
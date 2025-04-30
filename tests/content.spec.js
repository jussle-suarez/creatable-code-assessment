import { test, expect } from '@playwright/test';
const ContentPage = require('./../pages/content.page.js');

let contentPage;

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
    const productCountContentPage = page.getByTestId('content-239485319').getByRole('button');
    const countFromContentPage = await contentPage.getProductCountInContentPage(productCountContentPage);

    await contentPage.productImage.click();
    const countFromContentDetailsPage = await contentPage.getProductCountInContentDetailsPage();

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
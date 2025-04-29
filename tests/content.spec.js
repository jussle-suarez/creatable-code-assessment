import { test, expect } from '@playwright/test';
const ContentPage = require('./../pages/content.page.js');

let contentPage;

test.beforeEach(async ({ page }) => {
    contentPage = new ContentPage(page);
    await page.goto('/');
    await contentPage.login();
    await contentPage.navigateToContentPage();
})

test('Verify key elements in Content page are visible', async ({ page }) => {
    await expect(contentPage.contentHeader).toBeVisible();
    await expect(contentPage.searchField).toBeVisible();
    await expect(contentPage.campaignModerationWorkflow).toBeVisible();
    await expect(contentPage.creatorSearchAndBook).toBeVisible();
    await expect(contentPage.imageAsset).toBeVisible();
    await expect(contentPage.productImage).toBeVisible();
});
import { test, expect } from '@playwright/test';
const ContentPage = require('./../pages/content.page.js');

let contentPage;

test.beforeEach(async ({ page }) => {
    contentPage = new ContentPage(page);
    await page.goto('/');
    await contentPage.login();
})

test('test', async ({ page }) => {
    // start writing test
});
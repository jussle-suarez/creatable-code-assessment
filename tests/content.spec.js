import { test, expect } from '@playwright/test';
const ContentPage = require('./../pages/content.page.js');

let contentPage, countFromContentPage, countFromContentDetailsPage, productCountContentPage, captionFieldValue, testId;

test.beforeEach(async ({ page }, testInfo) => {
    testId = testInfo.title.slice(0, 6);
    contentPage = new ContentPage(page, testId);
    await page.goto('/');
    await contentPage.login();
    await contentPage.navigateToContentPage();
    await test.step('Photo Content Clean Up', async () => {
        await contentPage.photoContentCleanUp();
    });
    await test.step('Verify Photo Content is cleaned up', async ({ }) => {
        await contentPage.navigateToContentPage();
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId);
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
})

test('TC_001 - Verify key elements in Content page are visible', async ({ page }) => {
    await expect(page).toHaveURL('https://creators.creatable.io/5a018367/content');
    await expect(contentPage.contentHeader).toBeVisible();
    await expect(contentPage.searchField).toBeVisible();
    await expect(contentPage.createButton).toBeVisible();
});

test('TC_002 - Verify user is able to create photo content', async ({ page }) => {
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    await test.step('Verify Created photo content is displayed in Content page', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId);
        const contentTitle = await contentPage.getContentTitle('Photo Content ' + testId);
        await expect(contentTitle).toBe('Photo Content ' + testId);
    });
});

// Status set to skip. Working on Local but failing on GA -- need further investigation
test.skip('TC_003 - Verify user is able to create video content', async ({ page }) => {
    await test.step('Video Content Clean Up', async () => {
        await contentPage.videoContentCleanUp();
    });
    await test.step('Verify Video Content is cleaned up', async ({ }) => {
        await contentPage.navigateToContentPage();
        await contentPage.clearSearchField();
        await contentPage.searchData('Video Content ' + testId);
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
    await test.step('Create Video Content', async ({ page }) => {
        await contentPage.createVideoContent('Video Content '
            , 'This is a description of video content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'Schluter Shelf Triangular Corner Floral Bronze'
        );
    });
    await test.step('Verify Created video content is displayed in Content page', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Video Content ' + testId);
        const contentTitle = await contentPage.getContentTitle('Video Content ' + testId);
        await expect(contentTitle).toBe('Video Content ' + testId);
    });
    await test.step('Video Content Clean Up', async () => {
        await contentPage.videoContentCleanUp();
    });

    await test.step('Verify Photo Content is cleaned up', async ({ }) => {
        await contentPage.navigateToContentPage();
        await contentPage.clearSearchField();
        await contentPage.searchData('Video Content ' + testId);
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
});

test('TC_004 - Verify Search feature works as expected', async ({ page }) => {
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    await test.step('User search for valid data', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId);
        const contentTitle = await contentPage.getContentTitle('Photo Content ' + testId);
        await expect(contentTitle).toBe('Photo Content ' + testId);
    });
    await test.step('User search for invalid data', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Non Existing Photo Content ' + testId);
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
});

test('TC_005 - Verify Key Elements of content details are displayed', async ({ page }) => {
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    await contentPage.clickContentTitleBasedOnContentName('Photo Content ' + testId);
    await test.step('Verify key elements are displayed', async () => {
        await expect(contentPage.contentDetailsPendingStatus).toBeVisible();
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

test('TC_006 - Verify Product count from Content page and Content details are equal.', async ({ page }) => {
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    // Get count from content page
    countFromContentPage = await contentPage.getProductCountInContentPage('Photo Content ' + testId);

    await contentPage.clickContentTitleBasedOnContentName('Photo Content ' + testId);

    // Get count from content details page
    countFromContentDetailsPage = await contentPage.getProductCountInContentDetailsPage();

    await test.step('Compare count from content page is equal to content details page', async () => {
        await expect(countFromContentPage).toBe(countFromContentDetailsPage);
    });
});

// Status set to skip. Working on Local but failing on GA -- need further investigation
test.skip('TC_007 - Verify Content Title is updated after updating via Content Details page', async ({ page }) => {
    await test.step('Photo Content Clean Up', async () => {
        await contentPage.photoContentCleanUpByName('Photo Content ' + testId + ' v2');
    });
    await test.step('Verify Photo Content is cleaned up', async ({ }) => {
        await contentPage.navigateToContentPage();
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId + ' v2');
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    await test.step('Verify Created photo content is displayed in Content page', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId);
        const contentTitle = await contentPage.getContentTitle('Photo Content ' + testId);
        await expect(contentTitle).toBe('Photo Content ' + testId);
    });
    await test.step('Update content title', async () => {
        await contentPage.clearSearchField();
        await contentPage.clickContentTitleBasedOnContentName('Photo Content ' + testId);
        await contentPage.titleField.clear();
        await contentPage.titleField.fill('Photo Content ' + testId + ' v2');
        await contentPage.saveButton.click();
    });
    await test.step('Verify Content title is updated', async () => {
        await contentPage.searchData('Photo Content ' + testId + ' v2');
        const contentTitle = await contentPage.getContentTitle('Photo Content ' + testId + ' v2');
        await expect(contentTitle).toBe('Photo Content ' + testId + ' v2');
    });
    await test.step('Photo Content Clean Up', async () => {
        await contentPage.photoContentCleanUpByName('Photo Content ' + testId + ' v2');
    });
    await test.step('Verify Photo Content is cleaned up', async ({ }) => {
        await contentPage.navigateToContentPage();
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId + ' v2');
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
});

// Status set to skip. Working on Local but failing on GA -- need further investigation
test.skip('TC_008 - Verify Content Product counts is updated after adding more product.', async ({ page }) => {
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    await test.step('Verify Created photo content is displayed in Content page', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId);
        const contentTitle = await contentPage.getContentTitle('Photo Content ' + testId);
        await expect(contentTitle).toBe('Photo Content ' + testId);
    });
    await test.step('Add more product', async () => {
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId);
        await contentPage.clickContentTitleBasedOnContentName('Photo Content ' + testId);
        countFromContentDetailsPage = await contentPage.getProductCountInContentDetailsPage();
        await contentPage.matchButton.click();
        await contentPage.addProduct('Schluter Kerdi-Drain 4in. Grate Stone Grey Pure');
        await contentPage.addProduct('Schluter Designbase-SL End Cap Right 4 3/8in. Stainless Steel')
        countFromContentDetailsPage = Number(countFromContentDetailsPage) + 2;
    });
    await test.step('Verify Content Product count is updated', async () => {
        await page.goto('/');
        await contentPage.navigateToContentPage();
        countFromContentPage = await contentPage.getProductCountInContentPage('Photo Content ' + testId);
        await expect(countFromContentDetailsPage).toBe(Number(countFromContentPage));
    });
});

test('TC_009 - Verify Share button works as expected.', async ({ page }) => {
    await page.goto('/');
    await contentPage.navigateToContentPage();
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

test('TC_010 - Verify Copy link button works as expected.', async ({ page }) => {
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    await contentPage.clickContentTitleBasedOnContentName('Photo Content ' + testId);
    await test.step('Verify toast message will show on click of copy link button', async () => {
        await contentPage.clickCopyLinkButton('Schluter Kerdi-Drain 4in. Grate Matte White Pure');
        await expect(contentPage.copyLinkToastMessage).toBeVisible();
    });
    await test.step('Verify link contains https://c-linx.com/', async () => {
        await contentPage.captionField.click();
        await contentPage.captionField.clear();
        await contentPage.pasteCopyLinkValue();
        captionFieldValue = await contentPage.getCaptionFieldText();
        await expect(captionFieldValue).toContain('https://c-linx.com/');
    });
});

test('TC_011 - Verify Copy All link button works as expected.', async ({ page }) => {
    await test.step('Create Photo Content', async ({ page }) => {
        await contentPage.createPhotoContent('Photo Content '
            , 'This is a description of photo content related to '
            , 'Schluter Kerdi-Drain 4in. Grate Matte White Pure'
            , 'useSelectedProductPhoto');
    });
    await test.step('Verify toast message will show on click of copy link button', async () => {
        await contentPage.clickContentTitleBasedOnContentName('Photo Content ' + testId);
        await contentPage.copyAllButton.click();
        await expect(contentPage.copyLinksToastMessage).toBeVisible();
    });
    await test.step('Verify link contains https://c-linx.com/', async () => {
        await contentPage.captionField.click();
        await contentPage.captionField.clear();
        await contentPage.pasteCopyLinkValue();
        captionFieldValue = await contentPage.getCaptionFieldText();
        await expect(captionFieldValue).toContain('https://c-linx.com/');
    });
});

test.afterEach(async ({ page }) => {
    await test.step('Photo Content Clean Up', async () => {
        await contentPage.photoContentCleanUp();
    });
    await test.step('Verify Photo Content is cleaned up', async ({ }) => {
        await contentPage.navigateToContentPage();
        await contentPage.clearSearchField();
        await contentPage.searchData('Photo Content ' + testId);
        await expect(contentPage.noContentText).toBeVisible();
        await expect(contentPage.noContentImage).toBeVisible();
    });
})
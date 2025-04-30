const path = require('path')
const BasePage = require('./base.page.js');

class ContentPage extends BasePage {
    constructor(page, testId) {
        super(page);
        this.testId = testId;

        this.menu = page.getByRole('button', { name: 'menu' });
        this.contentMenuItem = page.getByRole('link', { name: 'Content' });

        // Header
        this.contentHeader = page.getByRole('heading', { name: 'Content' });
        this.searchField = page.getByRole('textbox', { name: 'Search' });
        this.searchFieldClearButton = page.getByTestId('CloseIcon');

        // Content table
        this.createButton = page.getByRole('button', { name: 'Content creation' });
        this.createPhotoContentButton = page.getByRole('menuitem', { name: 'Photo' });
        this.createVideoContentButton = page.getByRole('menuitem', { name: 'Video' });
        this.selectVideoButton = page.getByText('Select a video...');
        this.selectVideoInput = page.locator('//input[@accept]');
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.previousButton = page.locator('#photo-prev-step');
        this.processingSpinner = page.getByText('Processing...');
        this.pleaseWaitText = page.locator('div').filter({ hasText: /^Please wait until your photo is done uploading\.$/ }).nth(1);
        this.doneButton = page.getByRole('button', { name: 'Done' });
        this.campaignModerationWorkflow = page.getByTestId('content-239485273').getByText('Campaign moderation workflow');
        this.creatorSearchAndBook = page.getByTestId('content-239485300').getByText('Creator search and book');
        this.imageAsset = page.getByTestId('content-239485309').getByText('Image asset');
        this.productImage = page.getByTestId('content-239485319').getByText('Product image');

        // No Content message
        this.noContentText = page.getByText('You have no content to display.');
        this.noContentImage = page.getByTestId('PhotoLibraryIcon');

        // Workflow content details
        this.contentDetailsPublishedStatus = page.locator('#content-details-dialog').getByText('Published');
        this.contentDetailsPendingStatus = page.locator('#content-details-dialog').getByText('Pending');
        this.contentDetailsDraftStatus = page.locator('#content-details-dialog').getByText('Draft');
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.submitForReviewButton = page.getByRole('button', { name: 'Submit for review' });
        this.shareButton = page.getByRole('button', { name: 'Share' });
        this.titleField = page.getByRole('textbox', { name: 'Title' });
        this.captionField = page.getByRole('textbox', { name: 'Caption' });
        this.matchButton = page.getByRole('button', { name: 'Match' });
        this.copyAllButton = page.getByRole('button', { name: 'Copy all' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.copyLinkToastMessage = page.locator('div').filter({ hasText: /^Product Link Copied!$/ }).nth(1);
        this.copyLinksToastMessage = page.locator('div').filter({ hasText: /^Product Links Copied$/ }).nth(1);

        // Match products table
        this.searchMatchProductField = page.getByRole('textbox', { name: 'Search' })
        this.matchProductCloseButton = page.getByRole('banner').getByRole('button');

        // Share content modal
        this.shareContentHeader = page.locator('div').filter({ hasText: /^Share content$/ });
        this.shareContentModal = page.locator('div').filter({ hasText: /^InstagramTwitterLinkedInThreadsPinterestFacebook$/ }).first();
        this.instagramMenu = page.locator('a').filter({ hasText: 'Instagram' });
        this.twitterMenu = page.locator('a').filter({ hasText: 'Twitter' });
        this.linkedinMenu = page.locator('a').filter({ hasText: 'LinkedIn' });
        this.threadsMenu = page.locator('a').filter({ hasText: 'Threads' });
        this.pinterestMenu = page.locator('a').filter({ hasText: 'Pinterest' });
        this.facebookMenu = page.locator('a').filter({ hasText: 'Facebook' });

        // Delete photo modal
        this.noButton = page.getByRole('button', { name: 'No' });
        this.yesButton = page.getByRole('button', { name: 'Yes' });
    }

    async navigateToContentPage() {
        await this.menu.click();
        await this.contentMenuItem.click();
        await this.page.waitForLoadState('networkidle');
    }

    async searchData(searchKey) {
        await this.searchField.click();
        await this.searchField.pressSequentially(searchKey, { delay: 50 });
    }

    async clearSearchField() {
        await this.searchField.clear();
    }

    async getProductCountInContentPage(productName) {
        const contentProductCount = await this.page.locator('//div[contains(@data-testid,"content")]').filter({ hasText: productName }).getByRole('button').innerText();
        return contentProductCount;
    }

    async getProductCountInContentDetailsPage() {
        // Dynamic xpath was used to avoid strict mode violation error
        const contentProductDetailsCount = await this.page.locator('//p[text()="Products"]//preceding-sibling::p').innerText();
        return contentProductDetailsCount;
    }

    async getContentTitle(productName) {
        await this.page.waitForLoadState('networkidle');
        const contentTitle = await this.page.locator(`//div[contains(@data-testid,"content")]//div[text()="${productName}"]`).innerText();
        return contentTitle;
    }

    async clickContentTitleBasedOnContentName(productName) {
        await this.page.waitForLoadState('networkidle');
        const contentTitle = await this.page.locator(`//div[contains(@data-testid,"content")]//div[text()="${productName}"]`);
        await contentTitle.click();
    }

    async addProduct(productName) {
        await this.searchDataFromMatchProductsTable(productName);
        const addProductButton = this.page.getByRole('row', { name: `${productName}` }).getByTestId('AddIcon');
        await this.page.waitForLoadState('networkidle');
        await addProductButton.click();
        await this.clearSearchMatchProductsField();
    }

    async removeProduct(productName) {
        await this.searchDataFromMatchProductsTable(productName);
        const removeProductButton = this.page.getByRole('row', { name: `${productName}` }).getByTestId('RemoveIcon');
        await removeProductButton.click();
        await this.clearSearchMatchProductsField();
    }

    async searchDataFromMatchProductsTable(searchKey) {
        await this.searchMatchProductField.click();
        await this.searchMatchProductField.pressSequentially(searchKey, { delay: 50 });
        await this.page.waitForLoadState('networkidle');
    }

    async clearSearchMatchProductsField() {
        await this.searchMatchProductField.clear();
    }

    async clickCopyLinkButton(productName) {
        const productCopyLinkButton = this.page.getByRole('row', { name: productName }).getByRole('button').nth(1)
        await productCopyLinkButton.click();
    }

    async pasteCopyLinkValue() {
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('V');
        await this.page.keyboard.up('Control');
    }

    async getCaptionFieldText() {
        const captionFieldText = await this.captionField.textContent();
        return captionFieldText;
    }

    async clickProductPhoto(productName) {
        const productPhoto = this.page.locator('#photo-wizard').getByText(productName);
        await productPhoto.click();
    }

    async createPhotoContent(title, caption, productName, uploadType) {
        await this.createButton.hover();
        await this.createPhotoContentButton.click();
        await this.titleField.click();
        await this.titleField.fill(title + this.testId);
        await this.captionField.click();
        await this.captionField.fill(caption + this.testId);
        await this.nextButton.click();
        await this.addProduct(productName);
        await this.nextButton.click();
        if (uploadType === 'useSelectedProductPhoto') {
            await this.clickProductPhoto(productName);
        }
        let attempCount = 0;
        // wait until spinner is removed on dom then click Done button
        while (await this.processingSpinner.isVisible()  && attempCount < 50) {
            await this.page.waitForTimeout(500);
            attempCount++;           
            await this.doneButton.click();
        }
    }

    async createVideoContent(title, caption, productName) {
        await this.createButton.hover();
        await this.createVideoContentButton.click();
        await this.uploadVideo();
        await this.titleField.click();
        await this.titleField.pressSequentially(title + this.testId, { delay: 50 });
        await this.captionField.click();
        await this.captionField.pressSequentially(caption + this.testId, { delay: 50 });
        await this.nextButton.click();
        await this.addProduct(productName);
        await this.page.waitForTimeout(5000);
        await this.page.waitForLoadState('networkidle');
        await this.doneButton.click();
    }

    async uploadVideo() {
        const filePath = "../test-data/dummy_video.mp4";
        await this.selectVideoInput.setInputFiles(path.join(__dirname, filePath));
    }

    async photoContentCleanUp() {
        await this.page.goto('/');
        await this.navigateToContentPage();
        await this.searchData('Photo Content ' + this.testId);
        let isContentTitleDisplayed = await this.page.locator(`//div[contains(@data-testid,"content")]//div[text()="Photo Content ${this.testId}"]`).isVisible();
        if (isContentTitleDisplayed) {
            await this.clickContentTitleBasedOnContentName('Photo Content ' + this.testId);
            await this.deleteButton.click();
            await this.yesButton.click();
        }
    }

    async photoContentCleanUpByName(productName) {
        await this.page.goto('/');
        await this.navigateToContentPage();
        await this.searchData(productName);
        let isContentTitleDisplayed = await this.page.locator(`//div[contains(@data-testid,"content")]//div[text()="${productName}"]`).isVisible();
        if (isContentTitleDisplayed) {
            await this.clickContentTitleBasedOnContentName(productName);
            await this.deleteButton.click();
            await this.yesButton.click();
        }
    }

    async videoContentCleanUp() {
        await this.page.goto('/');
        await this.navigateToContentPage();
        await this.searchData('Video Content ' + this.testId);
        let isContentTitleDisplayed = await this.page.locator(`//div[contains(@data-testid,"content")]//div[text()="Video Content ${this.testId}"]`).isVisible();
        if (isContentTitleDisplayed) {
            await this.clickContentTitleBasedOnContentName('Video Content ' + this.testId);
            await this.deleteButton.click();
            await this.yesButton.click();
        }
    }
}

module.exports = ContentPage;
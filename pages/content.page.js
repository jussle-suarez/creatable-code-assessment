const BasePage = require('./base.page.js');

class ContentPage extends BasePage {
    constructor(page) {
        super(page);

        this.menu = page.getByRole('button', { name: 'menu' });
        this.contentMenuItem = page.getByRole('link', { name: 'Content' });

        // Header
        this.contentHeader = page.getByRole('heading', { name: 'Content' });
        this.searchField = page.getByRole('textbox', { name: 'Search' });
        this.searchFieldClearButton = page.getByTestId('CloseIcon');

        // Content table
        this.campaignModerationWorkflow = page.getByTestId('content-239485273').getByText('Campaign moderation workflow');
        this.creatorSearchAndBook = page.getByTestId('content-239485300').getByText('Creator search and book');
        this.imageAsset = page.getByTestId('content-239485309').getByText('Image asset');
        this.productImage = page.getByTestId('content-239485319').getByText('Product image');

        // No Content message
        this.noContentText = page.getByText('You have no content to display.');
        this.noContentImage = page.getByTestId('PhotoLibraryIcon');

        // Campaign moderation workflow content
        this.content1Status = page.getByTestId('content-239485273').getByText('Published');
        this.content1CreatedDate = page.getByTestId('content-239485273').getByText('04/26/');

        // Campaign moderation workflow content details
        this.contentDetailsStatus = page.locator('#content-details-dialog').getByText('Published');
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.submitForReviewButton = page.getByRole('button', { name: 'Submit for review' });
        this.shareButton = page.getByRole('button', { name: 'Share' });
        this.titleField = page.getByRole('textbox', { name: 'Title' });
        this.captionField = page.getByRole('textbox', { name: 'Caption' });
        this.matchButton = page.getByRole('button', { name: 'Match' });
        this.copyAllButton = page.getByRole('button', { name: 'Copy all' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        
        // Match products table
        this.searchMatchProductField = page.getByRole('textbox', { name: 'Search' })
        this.matchProductCloseButton = page.getByRole('banner').getByRole('button');
    
        // Share content modla
        this.shareContentHeader = page.locator('div').filter({ hasText: /^Share content$/ });
        this.shareContentModal = page.locator('div').filter({ hasText: /^InstagramTwitterLinkedInThreadsPinterestFacebook$/ }).first();
        this.instagramMenu = page.locator('a').filter({ hasText: 'Instagram' });
        this.twitterMenu = page.locator('a').filter({ hasText: 'Twitter' });
        this.linkedinMenu = page.locator('a').filter({ hasText: 'LinkedIn' });
        this.threadsMenu = page.locator('a').filter({ hasText: 'Threads' });
        this.pinterestMenu = page.locator('a').filter({ hasText: 'Pinterest' });
        this.facebookMenu = page.locator('a').filter({ hasText: 'Facebook' });
        
    }

    async navigateToContentPage() {
        await this.menu.click();
        await this.contentMenuItem.click();
        await this.page.waitForLoadState('networkidle');
    }

    async searchData(searchKey) {
        await this.searchField.click();
        await this.searchField.pressSequentially(searchKey, { delay: 100 });
    }

    async clearSearchField() {
        await this.searchField.clear();
    }

    async getProductCountInContentPage(locator) {
        const contentProductCount = await locator.innerText();
        return contentProductCount;
    }

    async getProductCountInContentDetailsPage() {
        // Dynamic xpath was used to avoid strict mode violation error
        const contentProductDetailsCount = await this.page.locator('//p[text()="Products"]//preceding-sibling::p').innerText();;
        return contentProductDetailsCount;
    }

    async getContentTitle(locator) {
        await this.page.waitForLoadState('networkidle');
        const contentTitle = await locator.locator('//div[@class="LinesEllipsis  "]').innerText();
        return contentTitle;
    }

    async clickContentTitleBasedOnTestId(locator) {
        const contentTitle = await locator.locator('//div[@class="LinesEllipsis  "]');
        await contentTitle.click();
    }

    async addProduct(productName) {
        await this.searchDataFromMatchProductsTable(productName);
        const addProductButton = this.page.getByRole('row', { name: `${productName}` }).getByTestId('AddIcon');
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
    }

    async clearSearchMatchProductsField() {
        await this.searchMatchProductField.clear();
    }

}

module.exports = ContentPage;
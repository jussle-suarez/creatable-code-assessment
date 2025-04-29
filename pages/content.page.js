const BasePage = require('./base.page.js');

class ContentPage extends BasePage {
    constructor(page) {
        super(page);

        this.menu = page.getByRole('button', { name: 'menu' });
        this.contentMenuItem = page.getByRole('link', { name: 'Content' });

        // Header
        this.contentHeader = page.getByRole('heading', { name: 'Content' });
        this.searchField = page.getByRole('textbox', { name: 'Search' });

        // Content table
        this.campaignModerationWorkflow = page.getByTestId('content-239485273').getByText('Campaign moderation workflow');
        this.creatorSearchAndBook = page.getByTestId('content-239485300').getByText('Creator search and book');
        this.imageAsset = page.getByTestId('content-239485309').getByText('Image asset');
        this.productImage = page.getByTestId('content-239485319').getByText('Product image');
    }

    async navigateToContentPage() {
        await this.menu.click();
        await this.contentMenuItem.click();
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = ContentPage;
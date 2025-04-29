class BasePage {
    constructor(page) {
        this.loginField = page.getByRole('textbox').and(page.locator('//input[@class="MuiInputBase-input MuiOutlinedInput-input"]'));
        this.passwordField = page.getByRole('textbox');
        this.nextButton = page.getByRole('button', { name: 'Next' });
    }

    async login() {
        await this.loginField.click();
        await this.loginField.fill(process.env.USER_EMAIL);
        await this.nextButton.click();
        await this.passwordField.click();
        await this.passwordField.fill(process.env.USER_PASSWORD);
        await this.nextButton.click();
    }
}
module.exports = BasePage;
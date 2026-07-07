export class DashboardPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Bienvenido/i });
  }

  async navigateTo(moduleName) {
    // Navigation is done by clicking links containing the module name
    await this.page.locator(`nav >> text=/${moduleName}/i`).first().click();
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible', timeout: 15000 });
  }
}

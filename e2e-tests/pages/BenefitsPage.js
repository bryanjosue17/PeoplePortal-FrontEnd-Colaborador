export class BenefitsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1, h2, h3, h4, h5, h6, .MuiTypography-root').filter({ hasText: /Beneficios/i }).first();
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
  }

  async interact({ onFormReady } = {}) {
    const redeemButton = this.page.getByRole('button', { name: /Canjear/i }).first();
    if (await redeemButton.isVisible()) {
      await redeemButton.click();
      if (onFormReady) await onFormReady();
      await this.page.getByRole('button', { name: /Cancelar|Cerrar/i }).first().click();
    }
  }
}

export class BenefitsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Beneficios/i, level: 5 });
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible' });
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

export class NominaPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Nómina|Recibos/i, level: 5 });
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }
}

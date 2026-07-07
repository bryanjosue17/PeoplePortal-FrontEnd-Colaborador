export class AnnouncementsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Comunicados|Anuncios/i, level: 5 });
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }
}

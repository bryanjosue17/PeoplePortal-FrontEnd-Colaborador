export class TeamRequestsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Mi Equipo/i, level: 5 });
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }
}

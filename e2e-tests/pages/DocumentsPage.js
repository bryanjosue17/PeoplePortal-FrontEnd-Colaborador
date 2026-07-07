export class DocumentsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /Documentos/i, level: 5 });
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible' });
  }

  // GET /api/documents/me
  async interactWithDocument() {
    await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    const searchBox = this.page.getByPlaceholder(/Buscar/i).first();
    if (await searchBox.isVisible()) {
      await searchBox.fill('contrato');
      await this.page.waitForTimeout(600);
      await searchBox.clear();
    }
  }
}

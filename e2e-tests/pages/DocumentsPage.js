export class DocumentsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1, h2, h3, h4, h5, h6, .MuiTypography-root').filter({ hasText: /Documentos|Mis Documentos/i }).first();
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
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

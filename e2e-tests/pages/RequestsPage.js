export class RequestsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h1, h2, h3, h4, h5, h6, .MuiTypography-root').filter({ hasText: /Solicitudes|Mis Solicitudes/i }).first();
  }

  async verifyLoaded() {
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
  }

  async interactWithNewRequest({ onFormReady1, onFormReady2 } = {}) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 8);
    const fmt = d => d.toISOString().split('T')[0];

    // === Tab 0: Vacaciones → POST /api/requests/vacation ===
    await this.page.locator('input[name="startDate"]').fill(fmt(tomorrow));
    await this.page.locator('input[name="endDate"]').fill(fmt(nextWeek));
    await this.page.locator('textarea[name="reason"], input[name="reason"]').first()
      .fill('Vacaciones de prueba E2E automatizadas — flujo completo');
    if (onFormReady1) await onFormReady1();
    await this.page.getByRole('button', { name: /Enviar Solicitud/i }).first().click();
    await this.page.getByText(/Solicitud creada exitosamente/i).first()
      .waitFor({ state: 'visible', timeout: 15000 });

    // === Tab 1: Constancias → POST /api/requests/certificate ===
    await this.page.getByRole('tab', { name: /Constancias/i }).first().click();
    await this.page.waitForTimeout(400); // esperar que React renderice el tab

    // MUI Select no tiene for/id vinculado → usar role="combobox"
    await this.page.getByRole('combobox').first().click();
    await this.page.getByRole('option', { name: /Constancia de Trabajo/i }).click();
    await this.page.locator('textarea[name="reason"], input[name="reason"]').first()
      .fill('Constancia de trabajo para trámites bancarios E2E');
    if (onFormReady2) await onFormReady2();
    await this.page.getByRole('button', { name: /Enviar Solicitud/i }).first().click();
    await this.page.getByText(/Solicitud creada exitosamente/i).first()
      .waitFor({ state: 'visible', timeout: 15000 });
  }
}

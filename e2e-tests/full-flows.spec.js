import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { DocumentsPage } from './pages/DocumentsPage.js';
import { RequestsPage } from './pages/RequestsPage.js';
import { TeamRequestsPage } from './pages/TeamRequestsPage.js';
import { AnnouncementsPage } from './pages/AnnouncementsPage.js';
import { BenefitsPage } from './pages/BenefitsPage.js';
import { NominaPage } from './pages/NominaPage.js';

// Configurar resolución 1080p y ejecución lenta
test.use({
  viewport: { width: 1920, height: 1080 },
  launchOptions: { slowMo: 600, args: ['--disable-gpu', '--no-sandbox'] },
});

test.describe('Portal Colaborador - Full Flows (POM based)', () => {

  test('debe recorrer todos los flujos de forma secuencial y estructurada', async ({ page }) => {
    test.setTimeout(240000); // Flujos completos con llamadas a API reales
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const profilePage = new ProfilePage(page);
    const documentsPage = new DocumentsPage(page);
    const requestsPage = new RequestsPage(page);
    const teamRequestsPage = new TeamRequestsPage(page);
    const announcementsPage = new AnnouncementsPage(page);
    const benefitsPage = new BenefitsPage(page);
    const nominaPage = new NominaPage(page);

    const shot = async (label) => {
      const buf = await page.screenshot({ fullPage: false });
      await test.info().attach(label, { body: buf, contentType: 'image/png' });
      await page.screenshot({ path: `../docs/colaborador/screenshots/${label}.png`, fullPage: false });
    };

    await test.step('1. Inicio de Sesión (Keycloak)', async () => {
      await loginPage.login('testmanager', 'test123');
      await dashboardPage.verifyLoaded();
      await shot('01-dashboard');
    });

    await test.step('2. Módulo de Perfil', async () => {
      await dashboardPage.navigateTo('perfil');
      await profilePage.verifyLoaded();
      await profilePage.interact({ onFormReady: () => shot('02-perfil-form') }); // PUT /api/employees/me
      await shot('02-perfil');
    });

    await test.step('3. Módulo de Documentos', async () => {
      await dashboardPage.navigateTo('documentos');
      await documentsPage.verifyLoaded();
      await documentsPage.interactWithDocument();
      await shot('03-documentos');
    });

    await test.step('4. Módulo de Mis Solicitudes', async () => {
      await dashboardPage.navigateTo('solicitudes$');
      await requestsPage.verifyLoaded();
      await requestsPage.interactWithNewRequest({
        onFormReady1: () => shot('04-solicitudes-vac-form'),
        onFormReady2: () => shot('04-solicitudes-const-form')
      }); // POST /api/requests/vacation + /certificate
      await shot('04-solicitudes');
    });

    await test.step('5. Módulo de Solicitudes de Equipo', async () => {
      const isManager = await page.locator('nav').getByText(/Mi Equipo/i).first().isVisible();
      if (isManager) {
        await dashboardPage.navigateTo('Mi Equipo');
        await teamRequestsPage.verifyLoaded();
        await shot('05-mi-equipo');
      }
    });

    await test.step('6. Módulo de Comunicados', async () => {
      await dashboardPage.navigateTo('comunicados');
      await announcementsPage.verifyLoaded();
      await shot('06-comunicados');
    });

    await test.step('7. Módulo de Beneficios', async () => {
      await dashboardPage.navigateTo('beneficios');
      await benefitsPage.verifyLoaded();
      await benefitsPage.interact({ onFormReady: () => shot('07-beneficios-form') });
      await shot('07-beneficios');
    });

    await test.step('8. Módulo de Nómina', async () => {
      await dashboardPage.navigateTo('Nómina');
      await nominaPage.verifyLoaded();
      await shot('08-nomina');
    });

    await test.step('9. Volver al Dashboard', async () => {
      await dashboardPage.navigateTo('dashboard');
      await dashboardPage.verifyLoaded();
      await shot('09-dashboard-final');
    });
  });
});

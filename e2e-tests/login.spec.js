import { test, expect } from '@playwright/test';

test.describe('Login Flow - Portal Colaborador', () => {
  test('debe iniciar sesión exitosamente a través de Keycloak y redirigir al Dashboard', async ({ page }) => {
    await test.step('1. Navegar a la aplicación', async () => {
      await page.goto('/');
    });

    await test.step('2. Validar redirección a Keycloak', async () => {
      await expect(page).toHaveURL(/.*localhost:30080.*realms.*/);
      await expect(page.getByLabel('Username or email')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    await test.step('3. Completar credenciales de Colaborador', async () => {
      await page.getByLabel('Username or email').fill('testmanager');
      await page.locator('input[name="password"]').fill('test123');
      await page.getByRole('button', { name: 'Sign In' }).click();
    });

    await test.step('4. Validar acceso exitoso al Dashboard', async () => {
      // El dashboard puede tardar en cargar dependiendo del AuthGuard, usamos auto-waiting con locators
      await expect(page).toHaveURL(/.*localhost:30081.*/);
      await expect(page.getByRole('heading', { name: /Dashboard/i })).toBeVisible({ timeout: 10000 });
      // Verificar que el usuario está logueado
      await expect(page.locator('body')).toContainText(/Test Manager/i);
    });
  });
});

import {expect, test} from '@playwright/test'

        // Describe para agrupar todos los casos de prueba relacionados con el login
test.describe('Login OrangeHRM', () => {
 
  test.beforeEach(async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  });
    
  test("Login exito", async ({page}) => {
        await page.getByRole('textbox', {name: 'Username'}).fill('Admin')
        await page.getByRole('textbox', {name: 'Password'}).fill('admin123')
        await page.getByRole('button', {name: 'Login'}).click()

        await page.waitForURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')
        await expect(page).toHaveURL(/dashboard/);
  });

    test("Login fallido", async ({page}) => {
        await page.getByRole('textbox', {name: 'Username'}).fill('Admin')
        await page.getByRole('textbox', {name: 'Password'}).fill('admin0123')
        await page.getByRole('button', {name: 'Login'}).click()

        // Validamos que aparezca el mensaje de error
        const errorMessage = page.locator('.oxd-alert-content-text');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Invalid credentials');

        // Y que seguimos en la página de login
        await expect(page).toHaveURL(/auth\/login/);
  });
  
    test("Login sin password", async ({page}) => {
        await page.getByRole('textbox', {name: 'Username'}).fill('Admin')
        await page.getByRole('button', {name: 'Login'}).click()

        // Validamos que aparezca el mensaje "Required" bajo el campo Password
        const requiredMessage = page
           .locator('.oxd-input-group')
           .filter({ has: page.locator('input[name="password"]') })
           .locator('.oxd-input-field-error-message');
    await expect(requiredMessage).toBeVisible();
    await expect(requiredMessage).toHaveText('Required');

        // Y que seguimos en la página de login
        await expect(page).toHaveURL(/auth\/login/);
  });
    
    test("Login sin usuario", async ({page}) => {
    await page.getByRole('textbox', {name: 'Password'}).fill('admin123')  // ← llenamos Password
    await page.getByRole('button', {name: 'Login'}).click()

    // Validamos que aparezca el mensaje "Required" esto se hace para validar el mensaje de error debajo del campo Username
    await expect(page.getByText('Required')).toBeVisible();

        // Y que seguimos en la página de login
        await expect(page).toHaveURL(/auth\/login/);
  });

});
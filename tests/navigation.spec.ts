import { test, expect } from "@playwright/test";

//Ingresar a la aplicación con el usuario Admin y contraseña admin123
test("navegacion menu options", async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    //Buscar Elementos del menu lateral izquierdo
    const leftMenuItems = page.getByLabel('Sidepanel').getByRole('listitem')
    const totalMenuItemsCount = await leftMenuItems.count()
    console.log('Current menu items count', totalMenuItemsCount)

    const currentMenuItems: string[] = []

    for (let i = 0; i < totalMenuItemsCount; i++) {
        const menuText = await leftMenuItems.nth(i).innerText()
        currentMenuItems.push(menuText)
    }

    //Imprimir los elementos del menu lateral izquierdo y compararlos con los elementos esperados
    console.log(currentMenuItems)

    const expectedMenuItems = [
        'Admin',
        'PIM',
        'Leave',
        'Time',
        'Recruitment',
        'My Info',
        'Performance',
        'Dashboard',
        'Directory',
        'Maintenance',
        'Claim',
        'Buzz'
    ];

    console.log('Lo que trajo la página:', currentMenuItems)
    console.log('Lo que esperaba:', expectedMenuItems)

    // Validar que los elementos del menu coincidan con los esperados
    await expect(currentMenuItems).toEqual(expectedMenuItems);
})

//Test 2: Ingresar a OrangeHRM y validar que la primera opcion del menu es Admin  y que la primera opcion del menu NO es PIM

test("Validar que la primera opcion del menu es Admin", async ({ page }) => {
    // Login
    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    // Obtener el primer item del menu lateral
    const firstMenuItem = page.getByLabel('Sidepanel').getByRole('listitem').first()

    // Extraer el texto y mostrarlo en consola
    const firstMenuItemText = await firstMenuItem.innerText()
    console.log('Primera opción del menú:', firstMenuItemText)

    //Validar que la primera opcion es "Admin"
    await expect(firstMenuItem).toHaveText('Admin')
})

test("Validar que la primera opcion del menu NO es PIM", async ({ page }) => {
    // Login
    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    // Obtener el primer item del menu lateral
    const firstMenuItem = page.getByLabel('Sidepanel').getByRole('listitem').first()

    // Extraer el texto y mostrarlo en consola
    const firstMenuItemText = await firstMenuItem.innerText()
    console.log('Primera opción del menú (no debería ser PIM):', firstMenuItemText)

    //Validar que la primera opcion NO es "PIM"
    await expect(firstMenuItem).not.toHaveText('PIM')
})

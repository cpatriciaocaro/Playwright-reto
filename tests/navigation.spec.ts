import { test, expect } from "@playwright/test";

//Test 1:Navegar Menu Options: Ingresar a OrangeHRM y validar que las opciones del menu lateral izquierdo sean las esperadas
test("navegacion menu options", async ({ page }) => {
    //Login
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

//Test 3: Ingresar a OrangeHRM e ingresar a cada una de las opciones del menu izquierdo
// Ingresar a cada una de las opciones del menu lateral izquierdo y validar que se ingresa correctamente a cada sección
test("Navegate through the left panel", async ({ page }) => {
    test.setTimeout(120000) // 120 segundos para dar tiempo a recorrer todo el menú

    // Login
    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    // Obtener el total de items del menu lateral
    const leftMenuItems = page.getByLabel('Sidepanel').getByRole('listitem')
    const totalMenuItemsCount = await leftMenuItems.count()
    console.log('Total de items en el menu:', totalMenuItemsCount)

    for (let i = 0; i < totalMenuItemsCount; i++) {
        const menuItem = leftMenuItems.nth(i)
        const menuText = await menuItem.innerText()
        console.log('Navegando a la sección:', menuText)

        //Esta opcion se utiliza cuando quiero saltar alguna sección del menu.
        // if (menuText === 'Maintenance') {
        //     console.log('Detectada Maintenance, saltando esta sección...')
        //     continue
        // }

        // Hacer clic en el item del menu
        await menuItem.click()

        // Validar que ingresó correctamente a la sección
        await expect(page).not.toHaveURL('https://opensource-demo.orangehrmlive.com/')
        console.log('Ingresó correctamente a:', menuText)

        // Cuando llegue a "Maintenance", navegar directo al dashboard y continuar
        if (menuText === 'Maintenance') {
            console.log('Detectada Maintenance, volviendo al dashboard...')
            await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index')
            await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()
            console.log('De vuelta en el dashboard, continuando el recorrido...')
        }
    }
})
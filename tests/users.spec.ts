import { expect, test } from "@playwright/test"

//Obtener los datos registrados en la columna Employee Name de la tabla de usuarios. 

test('Get all the usernames registered nth 3', async ({ page }) => {

    await page.goto('https://opensource-demo.orangehrmlive.com/')
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin')
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123')
    await page.getByRole('button', { name: 'Login' }).click()

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

    await page.getByRole('link', { name: 'Admin' }).click()

    await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management').click()
    await page.getByRole('menuitem', { name: 'Users' }).click()

    const rows = page.getByRole('table').getByRole('row')
    const EmployeeName: string[] = []

    const rowCount = await rows.count()

    for (let i = 1; i < rowCount; i++) {

        const cell = rows.nth(i).getByRole('cell').nth(3)
        const employeeName = await cell.textContent()

        if (employeeName) {
            EmployeeName.push(employeeName)
        }
    }

    console.log(EmployeeName)

})
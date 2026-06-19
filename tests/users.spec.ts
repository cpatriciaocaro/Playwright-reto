import { test, expect, Page, Locator } from '@playwright/test';
import { LoginPage } from '../pageobjects/LoginPage';

/**
 * Selecciona un valor aleatorio de una columna de una tabla, excluyendo "Admin".
 */
async function obtenerValorAleatorioDeColumna(
  page: Page,
  selectorColumna: string,
  excluir: string[] = []
): Promise<string> {
  const columna: Locator = page.locator(selectorColumna);

  // Esperar a que la tabla termine de cargar y la columna esté visible
  await columna.first().waitFor({ state: 'visible' });

  let valores: string[] = await columna.allTextContents();

  valores = valores.map(v => v.trim()).filter(v => !excluir.includes(v));

  if (valores.length === 0) {
    throw new Error('No se encontraron valores en la columna especificada (después de excluir)');
  }

  const indiceAleatorio = Math.floor(Math.random() * valores.length);
  return valores[indiceAleatorio];
}

function escapeRegExp(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

//Obtener los datos registrados en la columna Employee Name de la tabla de usuarios. 
test('Get all the usernames registered nth 3', async ({ page }) => {

    const loginPage = new LoginPage(page)
    await loginPage.login('Admin', 'admin123')
    
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

test('Select specific user for edition', async ({ page }) => {
  // --- Login ---
  const loginPage = new LoginPage(page)
  await loginPage.login('Admin', 'admin123')

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible()

  // --- Navegación hacia Users ---
  await page.getByRole('link', { name: 'Admin' }).click()
  await page.getByRole('navigation', { name: 'Topbar menu' }).getByText('User Management').click()
  await page.getByRole('menuitem', { name: 'Users' }).click()

  // --- Selección aleatoria de usuario (excluyendo "Admin") ---
  // Columna 2 = Username. Uso la clase real de OrangeHRM, no <td>,
  // porque la tabla está hecha con divs, no con elementos HTML <table>.
  const userForEdition = await obtenerValorAleatorioDeColumna(
    page,
    '.oxd-table-cell:nth-child(2)',
    ['Admin']
  )
  console.log('Usuario seleccionado:', userForEdition)

  // --- Buscar la fila del usuario y hacer clic en el lápiz de editar ---
  // Usamos coincidencia EXACTA (regex con ^...$) y solo en la columna 2 (Username),
  // para evitar coincidencias accidentales con texto de otras columnas/filas.
  const filaDelUsuario = page
    .getByRole('row')
    .filter({
      has: page.locator('.oxd-table-cell:nth-child(2)', {
        hasText: new RegExp(`^${escapeRegExp(userForEdition)}$`)
      })
    })

  const pencilToEdit = filaDelUsuario
    .locator('.oxd-table-cell:nth-child(6)')
    .locator('button')
    .filter({ has: page.locator('i.bi-pencil-fill') })

  await pencilToEdit.click()

  // --- Verificar que el formulario de edición muestra el username correcto ---
  // El input no tiene id/name/aria-label, así que no podemos usar getByRole con name.
  // Navegamos por XPath: del label "Username" subimos al padre,
  // saltamos al div hermano siguiente, y ahí está el input.
  const usernameInput = page.locator("//label[contains(., 'Username')]/parent::div/following-sibling::div/input")
  
  // Espera (con auto-retry) a que el input tenga el valor esperado
  await expect(usernameInput).toHaveValue(userForEdition)

  // Recién acá leemos el valor para loguearlo, porque ya sabemos que está cargado
  const usernameEnFormulario = await usernameInput.inputValue()

    console.log('Usuario mostrado en el formulario:', usernameEnFormulario)

})
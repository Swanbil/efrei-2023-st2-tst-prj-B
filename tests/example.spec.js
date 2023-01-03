// @ts-check
const { test, expect } = require('@playwright/test');
import { HomePage } from '../pages/home.page';
import { AddNewEmployeePage } from '../pages/addNewEmployee.page';
import { AddNewTeamsPage } from '../pages/addNewTeams.page';
import { ListEmployeePage } from '../pages/listEmployee.page';
import { ListTeamPage } from '../pages/listTeams.page';
import { ResetDatabasePage } from '../pages/resetDatabase.page';

test.beforeEach(async ({ page }) => {
  const homepage = new HomePage(page);
  await homepage.goto();
});


// //Display teams
test('Display team', async ({ page }) => {
  const pageTeams = page.getByRole('link', { name: 'List teams' });
  await pageTeams.click();
  await expect(page).toHaveURL(/.*teams/);

  //Vérifier que les équipes s'affichent
});

//Create teams
test('Create team', async ({ page }) => {
  // create a locator
  const getStarted = page.getByRole('link', { name: 'Create new team' });

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*add_team/);

  // Fill the form.
  await page.fill('input[name="name"]', 'Test Team');

  // Click the submit button.
  await page.click('button:has-text("Add")');

  //Go to the page Teams
  await page.goto('https://b.hr.dmerej.info/teams');

  //Expect the page to contain the name of the team
  await expect(page.locator('table > tbody > tr').last()).toContainText('Test Team');

});

// Display teams members
test('Display team members', async ({ page }) => {
  const pageTeams = page.getByRole('link', { name: 'List teams' });
  await pageTeams.click();
  await expect(page).toHaveURL(/.*teams/);

  const linkViewMembers = page.locator('tr').last().locator('a:has-text("View members")');
  await linkViewMembers.click();
  await expect(page).toHaveURL(/.*members/);

  //Vérifier que les membres s'affichent
});

//Delete empty team
test('Delete empty team', async ({ page }) => {
  const pageTeams = page.getByRole('link', { name: 'List teams' });
  await pageTeams.click();
  await expect(page).toHaveURL(/.*teams/);

  const pageDelete = page.locator('tr').last().locator('a:has-text("Delete")');
  await pageDelete.click();

  const pageConfirmDelete = page.locator('button:has-text("Proceed")');
  await pageConfirmDelete.click();

  await expect(page).toHaveURL(/.*teams/);
});

//Create an employee
test('Create an employee', async ({ page }) => {
  const addNewEmployeePage = new AddNewEmployeePage(page)
  await addNewEmployeePage.goto();

  const employee = {
    name: "employee1",
    email: "employee1@email.com",
    address: "11 rue test",
    city: "Tokyo",
    zipCode: "11000",
    hiringDate: "2000-05-25",
    jobTitle: "Testor"
  };

  await addNewEmployeePage.createEmployee(employee);
  
  //return to list employee
  const listEmployeePage = new ListEmployeePage(page);
  await listEmployeePage.goto();
  
  //test if the list employee contain the new user
  await expect(listEmployeePage.page.locator('table > tbody > tr').last()).toContainText(employee.name + " " + employee.email);

})

test('List all employees with correct informations', async ({ page }) => {
  const pageListEmployees = page.getByRole('link', { name: 'List employees' });
  await pageListEmployees.click();

  let tableLocator = await page.locator('tbody tr');
  const employee = ["employee1", "employee1@email.com", "no", "Edit", "Delete"]

  let listEmployees = [];
  let listExpectedEmployees = [];
  for (const el of await tableLocator.elementHandles()) {
    const row = await el.innerText();
    listEmployees.push(row.toString().replace(/\t/g, '-'))
    listExpectedEmployees.push(employee.join('-'))
  }
  console.log("listEmployees", listEmployees)



});

test('homepage has title and links to list teams page', async ({ page }) => {
  const getStarted = page.getByRole('link', { name: 'List teams' });
  await expect(getStarted).toHaveAttribute('href', '/teams');
  await getStarted.click();
  await expect(page).toHaveURL(/.*teams/);
  const row1 = page.locator('tr:has-text("teamtest")');
  // await expect(row1).toEqual('teamtest'); // marche pas
});

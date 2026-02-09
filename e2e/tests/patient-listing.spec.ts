import { test, expect } from "@playwright/test";
import { PatientPage } from "../pages/patient-page";
import { database } from "../support/database";
import { seededPatients } from "../fixtures";

test.describe("Patient Listing", () => {
  let patientPage: PatientPage;

  test.beforeAll(async () => {
    await database.cleanup();
  });

  test.afterAll(async () => {
    await database.disconnect();
  });

  test("shows empty state when no patients exist", async ({ page }) => {
    patientPage = new PatientPage(page);
    await patientPage.goto();
    await patientPage.waitForPatients();

    await expect(patientPage.emptyState).toBeVisible();
    await expect(patientPage.patientCards).toHaveCount(0);
  });

  test("displays patients after seeding", async ({ page }) => {
    await database.cleanup();
    await database.seed(seededPatients);

    patientPage = new PatientPage(page);
    await patientPage.goto();
    await patientPage.waitForPatients();

    const count = await patientPage.getPatientCount();
    expect(count).toBe(5);
    await expect(patientPage.patientCards).toHaveCount(5);
  });

  test("pagination works correctly with many patients", async ({ page }) => {
    const manyPatients = Array.from({ length: 20 }, (_, i) => ({
      fullName: `Pagination Patient ${i + 1}`,
      email: `pagination${i + 1}@gmail.com`,
      phoneCode: "+1",
      phoneNumber: `555111000${i}`,
      documentUrl: "/uploads/avatar-1.jpg",
    }));

    await database.cleanup();
    await database.seed(manyPatients);

    patientPage = new PatientPage(page);
    await patientPage.goto();
    await patientPage.waitForPatients();

    await expect(patientPage.pagination).toBeVisible();

    const nextButton = page.getByRole("button", { name: /next/i });
    await nextButton.click();

    const page2Button = page.getByRole("button", { name: "2", exact: true });
    await expect(page2Button).toHaveAttribute("aria-current", "page");
  });

  test("hero collapse toggle changes container height", async ({ page }) => {
    await database.cleanup();
    await database.seed(seededPatients);

    patientPage = new PatientPage(page);
    await patientPage.goto();
    await patientPage.waitForPatients();

    const toggleButton = page.getByRole("button", { name: /hide banner/i });
    await toggleButton.click();

    await page.waitForTimeout(1100);

    await expect(patientPage.scrollContainer).toHaveClass(/h-\[600px\]/);
  });
});

import { test, expect } from "@playwright/test";
import { PatientPage } from "../pages/patient-page";
import { RegistrationModal } from "../pages/registration-modal";
import { database } from "../support/database";

test.describe("Error Handling", () => {
  test.beforeAll(async () => {
    await database.cleanup();
  });

  test.afterAll(async () => {
    await database.disconnect();
  });

  test("shows error toast when API returns error", async ({ page }) => {
    await page.route("**/api/patients*", (route) =>
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Server error" }),
      })
    );

    const patientPage = new PatientPage(page);
    await patientPage.goto();

    await patientPage.expectErrorToast(/failed to load patients/i);
  });

  test.skip("shows network error when offline during submission", async ({
    page,
    context,
  }) => {
    const patientPage = new PatientPage(page);
    const modal = new RegistrationModal(page);

    await patientPage.goto();
    await patientPage.waitForPatients();

    await patientPage.openRegistrationModal();

    await modal.fillForm({
      fullName: "Test User",
      email: "test@gmail.com",
      phoneNumber: "5551234567",
    });
    await modal.uploadFile();

    await context.setOffline(true);
    await modal.submit();

    await patientPage.expectErrorToast(/unable to connect|network error/i);

    await context.setOffline(false);
  });

  test("rejects invalid file types in dropzone", async ({ page }) => {
    const patientPage = new PatientPage(page);
    const modal = new RegistrationModal(page);

    await patientPage.goto();
    await patientPage.openRegistrationModal();

    await modal.fileInput.setInputFiles({
      name: "test.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("test content"),
    });

    await expect(page.getByText(/drag & drop|click to upload/i)).toBeVisible();
  });

  test("handles API validation errors gracefully", async ({ page }) => {
    await page.route("**/api/patients", (route) => {
      if (route.request().method() === "POST") {
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({
            errors: { email: "Email already registered" },
          }),
        });
      }
      return route.continue();
    });

    const patientPage = new PatientPage(page);
    const modal = new RegistrationModal(page);

    await patientPage.goto();
    await patientPage.waitForPatients();
    await patientPage.openRegistrationModal();

    await modal.fillForm({
      fullName: "Test User",
      email: "test@gmail.com",
      phoneNumber: "5551234567",
    });
    await modal.uploadFile();
    await modal.submit();

    await patientPage.expectErrorToast(/email already registered/i);
  });
});

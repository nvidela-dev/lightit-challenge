import { test, expect } from "@playwright/test";
import { PatientPage } from "../pages/patient-page";
import { RegistrationModal } from "../pages/registration-modal";
import { database } from "../support/database";
import { mailpit } from "../support/mailpit";
import { createTestPatient } from "../fixtures";

test.describe("Email Notifications", () => {
  test.beforeAll(async () => {
    await database.cleanup();
    await mailpit.clear();
  });

  test.afterAll(async () => {
    await database.disconnect();
  });

  test("sends confirmation email after registration", async ({ page }) => {
    const testData = createTestPatient();
    const patientPage = new PatientPage(page);
    const modal = new RegistrationModal(page);

    await patientPage.goto();
    await patientPage.openRegistrationModal();
    await modal.fillForm(testData);
    await modal.uploadFile();
    await modal.submit();
    await modal.waitForClose();

    const email = await mailpit.waitForEmail(testData.email, 15000);

    expect(email).toBeTruthy();
    expect(email.Subject).toBe("Registration Confirmed");
  });

  test("email contains correct patient name", async ({ page }) => {
    await mailpit.clear();

    const testData = {
      ...createTestPatient(),
      fullName: "Maria Garcia",
    };

    const patientPage = new PatientPage(page);
    const modal = new RegistrationModal(page);

    await patientPage.goto();
    await patientPage.openRegistrationModal();
    await modal.fillForm(testData);
    await modal.uploadFile();
    await modal.submit();
    await modal.waitForClose();

    const email = await mailpit.waitForEmail(testData.email);
    const html = await mailpit.getMessageHtml(email.ID);

    expect(html).toContain("Maria Garcia");
  });
});

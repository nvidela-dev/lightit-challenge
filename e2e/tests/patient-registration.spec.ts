import { test, expect } from "@playwright/test";
import { PatientPage } from "../pages/patient-page";
import { RegistrationModal } from "../pages/registration-modal";
import { database } from "../support/database";
import { mailpit } from "../support/mailpit";
import { createTestPatient } from "../fixtures";

test.describe("Patient Registration", () => {
  let patientPage: PatientPage;
  let modal: RegistrationModal;

  test.beforeAll(async () => {
    await database.cleanup();
    await mailpit.clear();
  });

  test.beforeEach(async ({ page }) => {
    patientPage = new PatientPage(page);
    modal = new RegistrationModal(page);
    await patientPage.goto();
  });

  test.afterAll(async () => {
    await database.disconnect();
  });

  test("successfully registers a new patient", async ({ page }) => {
    const testData = createTestPatient();

    await patientPage.openRegistrationModal();
    await expect(modal.modal).toBeVisible();

    await modal.fillForm(testData);
    await expect(modal.fullNameInput).toHaveValue(testData.fullName);

    await modal.uploadFile();
    await expect(page.getByText(/test-image\.jpg/i)).toBeVisible();

    await modal.submit();

    await modal.waitForClose();
    await patientPage.expectSuccessToast(`Email sent to ${testData.email}`);

    const patient = await database.findByEmail(testData.email);
    expect(patient).toBeTruthy();
    expect(patient?.fullName).toBe(testData.fullName);
  });

  test("shows validation errors for empty form", async () => {
    await patientPage.openRegistrationModal();
    await modal.submit();

    await modal.expectValidationError(
      "Full name must only contain letters and spaces"
    );
  });

  test("shows validation error for non-gmail email", async () => {
    await patientPage.openRegistrationModal();
    await modal.fillForm({
      fullName: "Test User",
      email: "test@yahoo.com",
      phoneNumber: "5551234567",
    });
    await modal.submit();

    await modal.expectValidationError("Email must be a @gmail.com address");
  });

  test("shows validation error for invalid phone number", async () => {
    await patientPage.openRegistrationModal();
    await modal.fillForm({
      fullName: "Test User",
      email: "test@gmail.com",
      phoneNumber: "123",
    });
    await modal.submit();

    await modal.expectValidationError("Phone number must be 6-15 digits");
  });

  test("shows error for missing document photo", async () => {
    await patientPage.openRegistrationModal();
    await modal.fillForm(createTestPatient());
    await modal.submit();

    await modal.expectValidationError("Document photo is required");
  });

  test("shows error for duplicate email", async ({ page }) => {
    const testData = createTestPatient();

    await patientPage.openRegistrationModal();
    await modal.fillForm(testData);
    await modal.uploadFile();
    await modal.submit();
    await modal.waitForClose();

    await page.reload();
    await patientPage.openRegistrationModal();
    await modal.fillForm(testData);
    await modal.uploadFile();
    await modal.submit();

    await patientPage.expectErrorToast(/already exists/i);
  });

  test("can close modal without submitting", async () => {
    await patientPage.openRegistrationModal();
    await modal.close();
    await modal.waitForClose();

    await expect(modal.modal).not.toBeVisible();
  });
});

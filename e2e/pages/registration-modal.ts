import { type Page, type Locator, expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class RegistrationModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly fileInput: Locator;
  readonly submitButton: Locator;
  readonly closeButton: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = page.getByRole("dialog");
    this.fullNameInput = page.getByRole("textbox", { name: "Full Name" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.phoneCodeInput = page.getByLabel("Country code");
    this.phoneNumberInput = page.getByLabel("Phone number");
    this.fileInput = page.locator('input[type="file"]');
    this.submitButton = page.getByRole("button", { name: /register patient/i });
    this.closeButton = page.getByRole("button", { name: "Close", exact: true });
    this.loadingSpinner = page.getByText("Registering patient...");
  }

  async fillForm(data: {
    fullName: string;
    email: string;
    phoneCode?: string;
    phoneNumber: string;
  }) {
    await expect(this.modal).toBeVisible();
    await this.page.waitForTimeout(500);
    await this.fullNameInput.pressSequentially(data.fullName, { delay: 50 });
    await this.emailInput.pressSequentially(data.email, { delay: 50 });
    if (data.phoneCode) {
      await this.phoneCodeInput.clear();
      await this.phoneCodeInput.pressSequentially(data.phoneCode, { delay: 50 });
    }
    await this.phoneNumberInput.pressSequentially(data.phoneNumber, { delay: 50 });
  }

  async uploadFile(filename = "test-image.jpg") {
    const filePath = path.join(__dirname, "..", "fixtures", filename);
    await this.fileInput.setInputFiles(filePath);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectValidationError(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async waitForClose() {
    await expect(this.modal).not.toBeVisible({ timeout: 15000 });
  }

  async waitForLoading() {
    await expect(this.loadingSpinner).toBeVisible();
    await expect(this.loadingSpinner).not.toBeVisible({ timeout: 30000 });
  }

  async close() {
    await this.closeButton.click();
  }
}

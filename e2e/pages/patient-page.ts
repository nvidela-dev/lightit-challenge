import { type Page, type Locator, expect } from "@playwright/test";

export class PatientPage {
  readonly page: Page;
  readonly addPatientButton: Locator;
  readonly patientCards: Locator;
  readonly patientsHeading: Locator;
  readonly emptyState: Locator;
  readonly pagination: Locator;
  readonly collapseToggle: Locator;
  readonly scrollContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addPatientButton = page.getByRole("button", { name: /add patient/i });
    this.patientCards = page.locator(".glass-card");
    this.patientsHeading = page.locator("h2").filter({ hasText: "Patients" });
    this.emptyState = page.getByText("No patients yet");
    this.pagination = page.getByRole("navigation", { name: "Pagination" });
    this.collapseToggle = page.getByRole("button", {
      name: /show banner|hide banner/i,
    });
    this.scrollContainer = page.locator("[data-scroll-container]");
  }

  async goto() {
    await this.page.goto("/");
  }

  async openRegistrationModal() {
    await this.addPatientButton.first().click();
  }

  async waitForPatients() {
    await this.page.waitForResponse(
      (resp) =>
        resp.url().includes("/api/patients") && resp.status() === 200
    );
  }

  async getPatientCount(): Promise<number> {
    const text = await this.patientsHeading.textContent();
    const match = text?.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async expectSuccessToast(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectErrorToast(message: string | RegExp) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async toggleCollapse() {
    await this.collapseToggle.click();
  }
}

describe("The Validator Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("Shows the correct h1 element", () => {
    cy.get("h1").should("have.text", "IATI Validator");
  });
  it("Check Data button navigates to /validate", () => {
    cy.get('a[role=button][href="/validate"]').click();
    cy.url().should("includes", "/validate");
  });
  it("Public Data Viewer button navigates to /organisations", () => {
    cy.get('a[role=button][href="/organisations"]').click();
    cy.url().should("includes", "/organisations");
  });
  it("Public API button contains external link to Public API Documentation", () => {
    cy.get("#public-api-button")
      .invoke("attr", "href")
      .should("eq", "https://developer.iatistandard.org/api-details#api=iati-validator-v2");
  });
  it("Shows the version links", () => {
    cy.contains("Web v");
    cy.contains("Services v");
    cy.contains("API v");
  });
});

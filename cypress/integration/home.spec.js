describe("The Validator Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
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

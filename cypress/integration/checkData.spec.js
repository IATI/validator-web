describe("The Ad Hoc Validate Check Data page", () => {
  beforeEach(() => {
    cy.visit("/validate");
  });
  it("has the expected header contents", () => {
    cy.get("h1").should("have.text", "IATI Validator").siblings().should("have.text", "Check data");
  });
  it("starts with correctly active/inactive buttons", () => {
    cy.contains("label", "Browse").should("not.be.disabled");
    cy.contains("button", "Upload").should("be.disabled");
    cy.contains("a", "View Progress and Reports").parent().should("have.class", "pointer-events-none");
  });
  it("allows you to upload a file for validation and access the report", () => {
    cy.get("input[type=file").selectFile("cypress/fixtures/iati-act-no-errors.xml", { force: true });
    cy.contains("iati-act-no-errors.xml");
    cy.contains("button", "Upload").should("not.be.disabled").click();
    cy.contains("File(s) have been uploaded successfully", { timeout: 20000 });
    cy.contains("a", "View Progress and Reports").parent().should("not.have.class", "pointer-events-none");
    cy.contains("a", "View Progress and Reports").click();
    cy.url().should("includes", "/validate/");
    cy.contains("Validation results");
    cy.contains("iati-act-no-errors.xml");
    cy.get(".doc-list-item").eq(0).contains("Warning", { timeout: 20000 });
    cy.get(".doc-list-item").eq(0).click();
    cy.get("h1").should("have.text", "IATI Validator").siblings().should("have.text", "File validation report");
    cy.contains("IATI version");
    cy.contains("Type");
  });
  it("displays an error message if it fails to upload a file", () => {
    cy.get("input[type=file").selectFile("cypress/fixtures/incorrect-extension.txt", { force: true });
    cy.contains("incorrect-extension.txt");
    cy.contains("button", "Upload").should("not.be.disabled").click();
    cy.contains("File(s) uploading failed");
  });
  it("allows you to upload from URL for validation and access the report", () => {
    cy.contains("URL to a remote file").click();
    cy.get("#url").type(
      "https://raw.githubusercontent.com/IATI/IATI-Extra-Documentation/version-2.03/en/activity-standard/activity-standard-example-annotated.xml",
    );
    cy.contains("button", "Fetch").should("not.be.disabled").click();
    cy.contains("File(s) have been uploaded successfully", { timeout: 20000 });
    cy.contains("a", "View Progress and Reports").parent().should("not.have.class", "pointer-events-none");
    cy.contains("a", "View Progress and Reports").click();
    cy.url().should("includes", "/validate/");
    cy.contains("Validation results");
    cy.contains(
      "https://raw.githubusercontent.com/IATI/IATI-Extra-Documentation/version-2.03/en/activity-standard/activity-standard-example-annotated.xml",
    );
    cy.get(".doc-list-item").eq(0).contains("Error", { timeout: 20000 });
    cy.get(".doc-list-item").eq(0).click();
    cy.get("h1").should("have.text", "IATI Validator").siblings().should("have.text", "File validation report");
    cy.contains("IATI version");
    cy.contains("Type");
  });
  it("displays error message on validation page when the api is down", () => {
    cy.intercept("GET", "https://api.iatistandard.org/vs/pvt/adhoc/session/?sessionId=*", {
      statusCode: 500,
      body: { error: "Something went wrong" },
    });
    cy.intercept("GET", "https://dev-api.iatistandard.org/vs/pvt/adhoc/session/?sessionId=*", {
      statusCode: 500,
      body: { error: "Something went wrong" },
    });
    cy.intercept("GET", "http://localhost*/api/pvt/adhoc/session/?sessionId=*", {
      statusCode: 500,
      body: { error: "Something went wrong" },
    });
    cy.get("input[type=file").selectFile("cypress/fixtures/iati-act-no-errors.xml", { force: true });
    cy.contains("iati-act-no-errors.xml");
    cy.contains("button", "Upload").should("not.be.disabled").click();
    cy.contains("File(s) have been uploaded successfully", { timeout: 20000 });
    cy.contains("a", "View Progress and Reports").parent().should("not.have.class", "pointer-events-none");
    cy.contains("a", "View Progress and Reports").click();
    cy.contains("Failed to load iati data please try again later");
  });
});

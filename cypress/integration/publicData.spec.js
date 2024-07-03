import { getRandomInt } from "../support/utils";

describe("The Public Data Viewer (organisations) page", () => {
  beforeEach(() => {
    cy.visit("/organisations");
  });

  it("has the expected header contents", () => {
    cy.get("h1").should("have.text", "IATI Validator").siblings().should("have.text", "Public data viewer");
  });
  it("has the organisation count", () => {
    cy.get("#org-count");
  });
  it("has organisation links which take you to a single organisation page when a random one is clicked", () => {
    cy.get('a[href^="/organisation/"]').then((list) => {
      cy.get('a[href^="/organisation/"]').eq(getRandomInt(list.length)).click();
      cy.url().should("includes", "/organisation/");
    });
  });

  it("An organisation page displays a document list", () => {
    cy.intercept("**/pvt/publishers/*/documents", {
      fixture: "publicData/documents-fifty-eight.json",
    }).as("documents");

    // click on a random organisation that exists in the list -- we do this because
    // when running locally, the data one is using may not be complete, so we can't
    // rely on any givne publisher existing
    // the publisher's list of datasets is mocked (above), so don't need to worry about
    // publishers with zero datasets
    cy.get('a[href^="/organisation/"]').then((list) => {
      cy.get('a[href^="/organisation/"]').eq(getRandomInt(list.length)).click();
      cy.wait("@documents");
      cy.url().should("includes", "/organisation/");
      cy.get(".doc-list-item").then((list) => {
        expect(list.length).to.be.greaterThan(0);
      });
    });
  });

  it("A validation report page has expected headers and text", () => {
    cy.intercept("**/pvt/publishers/*/documents", {
      fixture: "publicData/documents-fifty-eight.json",
    }).as("documents");
    cy.intercept("**/pvt/publishers/*/reports", {
      fixture: "publicData/reports-fifty-eight.json",
    }).as("reports");

    cy.get('a[href^="/organisation/"]').then((organisations) => {
      if (organisations.length > 0) {
        cy.visit(organisations.first().attr("href"));

        cy.log("Visited organisation: ");
        cy.url().should("contain", "/organisation/");

        cy.get(".doc-list-item").then((datasets) => {
          if (datasets.length > 0) {
            cy.log(datasets);
            datasets.first().click();
            cy.wait(2000);
            cy.url().then((url) => {
              if (url.includes("/report/")) {
                cy.get("h1")
                  .should("have.text", "IATI Validator")
                  .siblings()
                  .should("have.text", "File validation report");
                cy.contains("IATI version");
                cy.contains("Type");
              }
            });
          }
        });
      }
    });
  });
});

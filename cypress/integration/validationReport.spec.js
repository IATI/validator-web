describe("The Validation Report page", () => {
  it("shows error message when an error validation report page contains a space in the attribute", () => {
    cy.fixture("validationReport01ares");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport01ares.json",
    }).as("validation");
    cy.visit("/report/ares-activities");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get(".iati-accordion").eq(2).children("div").find("button").eq(0).click({ force: true });
    cy.contains("An empty space was added to the attribute");
  });

  it("filters results when passed an IATI Identifier on query string", () => {
    cy.fixture("validationReport01ares");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport01ares.json",
    }).as("validation");
    cy.visit("/report/ares-activities?id=BE-BCE_KBO-0546740696-PG2017-2021_CD");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get("#search").should("have.value", "BE-BCE_KBO-0546740696-PG2017-2021_CD");
    cy.get(".iati-accordion").eq(2).children("div").find("button").should("have.length", 1);
    cy.get(".iati-accordion").eq(2).children("div").find("button").eq(0).click({ force: true });
    cy.contains("An empty space was added to the attribute");
  });

  it("uses paging when more than 10 IATI activities have errors", () => {
    cy.fixture("validationReport02moreThan10Activities");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport02moreThan10Activities.json",
    }).as("validation");
    cy.visit("/report/ares-activities");
    cy.wait("@validation");
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 10);
    cy.get(".iati-accordion").eq(2).find("span").eq(-1).should("contain", "Page 1 of");
    cy.get(".iati-accordion").eq(2).children("div").find("button").eq(-1).click({ force: true });
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 3);
  });

  it("filters results when passed an IATI Identifier on query string and paging is in operation", () => {
    cy.fixture("validationReport02moreThan10Activities");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport02moreThan10Activities.json",
    }).as("validation");
    cy.visit("/report/ares-activities?id=XM-TEST-VALIDATION-01-A-PROJECT-01626");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get("#search").should("have.value", "XM-TEST-VALIDATION-01-A-PROJECT-01626");
    cy.get(".iati-accordion").eq(2).children("div").find("button").should("have.length", 1);
    cy.get(".iati-accordion").eq(2).children("div").find("button").eq(0).click({ force: true });
    cy.contains("The organisation role is invalid");
    cy.contains("Budget Period must not be longer than one year");
  });

  it("filters results and still uses paging when search for IATI Identifier on query string gives more than 10 results", () => {
    cy.fixture("validationReport02moreThan10Activities");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport02moreThan10Activities.json",
    }).as("validation");
    cy.visit("/report/ares-activities?id=XM-TEST-VALIDATION-01-A");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get("#search").should("have.value", "XM-TEST-VALIDATION-01-A");
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 10);
    cy.get(".iati-accordion").eq(2).find("span").eq(-1).should("contain", "Page 1 of");
    cy.get(".iati-accordion").eq(2).children("div").find("button").eq(-1).click({ force: true });
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 1);
  });

  it("updates the displayed results after user does new search when on first page of search results", () => {
    cy.fixture("validationReport02moreThan10Activities");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport02moreThan10Activities.json",
    }).as("validation");
    cy.visit("/report/ares-activities?id=XM-TEST-VALIDATION-01-A");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get("#search").should("have.value", "XM-TEST-VALIDATION-01-A");
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 10);
    cy.get(".iati-accordion").eq(2).find("span").eq(-1).should("contain", "Page 1 of");
    cy.get("#search").clear();
    cy.get("#search").type("XM-TEST-VALIDATION-01-B-PROJECT-01926");
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 1);
  });

  it("updates the displayed results after user does new search when not on first page of search results", () => {
    cy.fixture("validationReport02moreThan10Activities");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport02moreThan10Activities.json",
    }).as("validation");
    cy.visit("/report/ares-activities?id=XM-TEST-VALIDATION-01-A");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get("#search").should("have.value", "XM-TEST-VALIDATION-01-A");
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 10);
    cy.get(".iati-accordion").eq(2).find("span").eq(-1).should("contain", "Page 1 of");
    cy.get(".iati-accordion").eq(2).children("div").find("button").eq(-1).click({ force: true });
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 1);

    cy.get("#search").clear();
    cy.get("#search").type("XM-TEST-VALIDATION-01-B-PROJECT-01926");
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 1);
  });

  it("updates the query string after user loads page then does new search", () => {
    cy.fixture("validationReport02moreThan10Activities");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport02moreThan10Activities.json",
    }).as("validation");
    cy.visit("/report/ares-activities");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get("#search").should("have.value", "");
    cy.get("#search").clear();
    cy.get("#search").type("XM-TEST-VALIDATION-01-B-PROJECT-01926");
    cy.get("#search").blur();
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 1);
    cy.location().should((loc) => {
      console.log(loc);
      expect(loc.search).to.eq("?id=XM-TEST-VALIDATION-01-B-PROJECT-01926");
    });
  });

  it("updates the query string after user loads page with existing search then does new search", () => {
    cy.fixture("validationReport02moreThan10Activities");
    cy.intercept("**/existing?name=ares-activities", {
      fixture: "validationReport02moreThan10Activities.json",
    }).as("validation");
    cy.visit("/report/ares-activities?id=XM-TEST-VALIDATION-01-A");
    cy.wait("@validation");
    cy.contains("Error");
    cy.get("#search").should("have.value", "XM-TEST-VALIDATION-01-A");
    cy.get("#search").clear();
    cy.get("#search").type("XM-TEST-VALIDATION-01-B");
    cy.get("#search").blur();
    cy.get(".iati-accordion").eq(2).find("div.mb-4").should("have.length", 2);
    cy.location().should((loc) => {
      console.log(loc);
      expect(loc.search).to.eq("?id=XM-TEST-VALIDATION-01-B");
    });
  });
});

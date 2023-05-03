describe('The Validation Report page', () => {
  it('an error validation report page with a space in the attribute code shows error message', () => {
    cy.fixture('validationReport').as('validationReportJson');
    cy.intercept('**/existing?name=ares-activities', {
      fixture: 'validationReport.json',
    }).as('validation');
    cy.visit('/report/ares-activities');
    cy.wait('@validation');
    cy.contains('Error');
    cy.get('.iati-accordion').eq(2).children('div').find('button').eq(0).click({ force: true });
    cy.contains('An empty space was added to the attribute');
  });
});

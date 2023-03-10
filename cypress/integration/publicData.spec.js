import { getRandomInt } from '../support/utils';

describe('The Public Data Viewer (organisations) page', () => {
  beforeEach(() => {
    cy.visit('/organisations');
  });
  it('has the expected header contents', () => {
    cy.get('h1').should('have.text', 'IATI Validator').siblings().should('have.text', 'Public data viewer');
  });
  it('has the organisation count', () => {
    cy.get('#org-count');
  });
  it('has organisation links which take you to a single organisation page when a random one is clicked', () => {
    cy.get('a[href^="/organisation/"]').then((list) => {
      cy.get('a[href^="/organisation/"]').eq(getRandomInt(list.length)).click();
      cy.url().should('includes', '/organisation/');
    });
  });
  it('a random organisation page has documents listed', () => {
    cy.get('a[href^="/organisation/"]').then((list) => {
      cy.get('a[href^="/organisation/"]').eq(getRandomInt(list.length)).click();
      cy.url().should('includes', '/organisation/');
      cy.get('.doc-list-item').then((list) => {
        expect(list.length).to.be.greaterThan(0);
      });
    });
  });
  it('a random validation report page has expected headers and text', () => {
    cy.get('a[href^="/organisation/"]').then((list) => {
      cy.get('a[href^="/organisation/"]').eq(getRandomInt(list.length)).click();
      cy.url().should('includes', '/organisation/');
      cy.get('.doc-list-item').then((list) => {
        cy.get('.doc-list-item').eq(getRandomInt(list.length)).click();
        cy.url().should('includes', '/report/');
        cy.get('h1').should('have.text', 'IATI Validator').siblings().should('have.text', 'File validation report');
        cy.contains('IATI version');
        cy.contains('Type');
      });
    });
  });
});

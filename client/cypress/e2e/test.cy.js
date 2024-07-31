describe('Test Bloc 3', () => {
  it('check connection', () => {
    cy.visit('http://localhost:5173/login')

    cy.get('[type="text"]').clear('    cy.visit(\'http://localhost:5173/login\')');
    cy.get('[type="text"]').type('john@smith.com');
    cy.get('[type="password"]').clear('a');
    cy.get('[type="password"]').type('azerty');
    cy.get('button').click();
    // cy.get(':nth-child(3) > p').should('have.text', '2');


    cy.get(':nth-child(2) > h3').should('have.text', 'Total des Livres');
    cy.get(':nth-child(3) > h3').should('have.text', 'Utilisateurs Enregistrés');
    cy.get(':nth-child(3) > p').should(($p) => {
      const text = $p.text();
      expect(parseInt(text)).to.be.greaterThan(2);
    });
    cy.get(':nth-child(2) > p').should(($p) => {
      const text = $p.text();
      expect(parseInt(text)).to.be.greaterThan(2);
    });

  })


  it('check list books', function() {

    cy.visit('localhost:5173');
    cy.get('tbody > :nth-child(1) > :nth-child(2)').click();
    cy.get('tbody > :nth-child(1) > :nth-child(2)').should('have.text', 'Developpement Web mobile avec HTML, CSS et JavaScript Pour les Nuls');

  });
})
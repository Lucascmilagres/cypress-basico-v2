// CAC-TAT.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Central de Atendimento ao Cliente TAT', function() {

  beforeEach(() => {
    cy.visit('./src/index.html');
  })

  it('verifica o título da aplicação', function(){
    cy.title().should('equal','Central de Atendimento ao Cliente TAT');
  })

  it('preenche os campos obrigatórios e envia o formulário', function () {
    //Criando uma variável para repetir um texto 
    const longText = Cypress._.repeat('Lorem ipsum dolor sit amet',15);

    //Ação
    cy.get('#firstName').type('Lucas');
    cy.get('#lastName').type('Costa Milagres').should('have.value','Costa Milagres',);
    cy.get('#email').type('lucasmilagres@teste.com').should('include.value','lucas');
    cy.get('#open-text-area').type(longText,{delay:0});
    cy.get('button[type="submit"]').click();

    //Resultado esperado
    cy.get('.success').should('be.visible');
  })

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
    //Ação
    cy.get('#firstName').type('Lucas');
    cy.get('#lastName').type('Costa Milagres');
    cy.get('#email').type('emailinválido');
    cy.get('#open-text-area').type('Teste');
    cy.contains('button', 'Enviar').click();

    //Resultado esperado 
    cy.get('.error').should('be.visible');
  })

  it('campo telefone continua vazio quando preenchido com um valor não-numérico', () => {
    cy.get('#phone')
      .type('Lucas.,;~][´\!@#$%¨&*()-=')
      .should('have.value','');
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.get('#firstName').type('Lucas');
    cy.get('#lastName').type('Costa Milagres');
    cy.get('#email').type('lucas@teste.com');
    cy.get('#open-text-area').type('Teste');
    cy.get('#phone-checkbox').check();
    cy.contains('.button', 'Enviar').click();

    cy.get('.error').should('be.visible');
  })

  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName')
    .type('Lucas')
    .should('have.value','Lucas')
    .clear()
    .should('have.value','');

    cy.get('#lastName')
    .type('Costa Milagres')
    .should('have.value','Costa Milagres')
    .clear()
    .should('have.value','');

    cy.get('#email')
    .type('lucas@teste.com')
    .should('have.value','lucas@teste.com')
    .clear()
    .should('have.value','');
    
    cy.get('#phone')
    .type('11942563100')
    .should('have.value','11942563100')
    .clear()
    .should('have.value','');
  })

  it.only('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('Enviar').click();

    cy.get('.error').should('be.visible');
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    const data = {
      firstName: 'Lucas',
      lastName: 'Costa Milagres',
      email: 'lucas@teste.com',
      phone: '11912345678',
      text: 'Texto de teste'
    }

    cy.fillMandatoryFieldsAndSubmit(data);

    cy.get('.success').should('be.visible');
  })

})
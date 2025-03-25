describe('Central de Atendimento ao Cliente TAT', function() {

  beforeEach(() => {
    cy.visit('./src/index.html');
  })

  it('verifica o título da aplicação', function(){
    cy.title().should('equal','Central de Atendimento ao Cliente TAT');
  })

  Cypress._.times(3, () => {
  it('preenche os campos obrigatórios e envia o formulário', function () {
    cy.clock();
    //Criando uma variável para repetir um texto 
    const longText = Cypress._.repeat('Lorem ipsum dolor sit amet',15);

    //Ação
    cy.get('#firstName').type('Lucas');
    cy.get('#lastName').type('Costa Milagres').should('have.value','Costa Milagres',);
    cy.get('#email').type('lucasmilagres@teste.com').should('include.value','lucas');
    cy.get('#open-text-area').type(longText,{ delay : 0 });
    cy.get('button[type="submit"]').click();

    //Resultado esperado
    cy.get('.success').should('be.visible');
    cy.tick(3000);
    cy.get('.success').should('not.be.visible');
    })
  });

  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
    cy.clock();
    //Ação
    cy.get('#firstName').type('Lucas');
    cy.get('#lastName').type('Costa Milagres');
    cy.get('#email').type('emailinválido');
    cy.get('#open-text-area').type('Teste');
    cy.contains('button', 'Enviar').click();

    //Resultado esperado 
    cy.get('.error').should('be.visible');
    cy.tick(3000);
    cy.get('.error').should('not.be.visible');
  })

  it('campo telefone continua vazio quando preenchido com um valor não-numérico', () => {
    cy.get('#phone')
      .type('Lucas.,;~][´\!@#$%¨&*()-=')
      .should('have.value','');
  })

  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock();
    cy.get('#firstName').type('Lucas');
    cy.get('#lastName').type('Costa Milagres');
    cy.get('#email').type('lucas@teste.com');
    cy.get('#open-text-area').type('Teste');
    cy.get('#phone-checkbox').check();
    cy.contains('.button', 'Enviar').click();

    cy.get('.error').should('be.visible');
    cy.tick(3000);
    cy.get('.error').should('not.be.visible');
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

  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock();
    cy.contains('Enviar').click();

    cy.get('.error').should('be.visible');
    cy.tick(3000);
    cy.get('.error').should('not.be.visible');
  })

  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.clock();
    const data = {
      firstName: 'Lucas',
      lastName: 'Costa Milagres',
      email: 'lucas@teste.com',
      phone: '11912345678',
      text: 'Texto de teste'
    }

    cy.fillMandatoryFieldsAndSubmit(data);

    cy.get('.success').should('be.visible');
    cy.tick(3000);
    cy.get('.success').should('not.be.visible');
  })

  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#product').select('YouTube')
    .should('have.value', 'youtube');
  })

  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#product').select('mentoria')
    .should('have.value', 'mentoria');
  })

  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#product').select(1)
    .should('have.value', 'blog');
  })

  it('seleciona um produto por seu índice de forma aleatória', () => {
    cy.get('select option')
    .not('[disabled]')
    .its('length', { log: false }).then(n => {
      cy.get('#product').select(Cypress._.random(1, n));
    })
  })

  it('marca o tipo de atendimento "Feedback"(Busca mais genérica)', () => {
    cy.get('[type="radio"]').check('feedback');

    cy.get('#support-type :checked').should('be.checked').and('have.value', 'feedback');
  })

  it('marca o tipo de atendimento "Feedback" (Busca mais específica)', () => {  
    cy.get('input[type="radio"][value="ajuda"]').check()
    .should('be.checked');
  })

  it('marca cada tipo de atendimento', () => {
    cy.get('[type="radio"]').each(typeOfService => {
      cy.wrap(typeOfService)
      .check()
      .should('be.checked');
    })
  })

  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('#check  input[type="checkbox"]').as('checkboxs').check().should('be.checked')

    cy.get('@checkboxs').last().uncheck().should('not.be.checked');
})

  it('seleciona um arquivo da pasta fixtures', () => {
  cy.get('#file-upload')
  .selectFile('cypress/fixtures/example.json')
  .should(input => {
    expect(input[0].files[0].name).to.equal('example.json')
  })
  })

  it('seleciona um arquivo simulando um drag-and-drop', () => {
  cy.get('#file-upload')
  .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
  .then(input => {
    expect(input[0].files[0].name).to.equal('example.json');
  })
  })

  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
  cy.fixture("example.json").as('sampleFile');
  cy.get('#file-upload').selectFile('@sampleFile')
  .then(input => {
    expect(input[0].files[0].name).to.equal('example.json');
  })
  })

  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
  cy.contains('a', 'Política de Privacidade')
  .should('have.attr', 'href', 'privacy.html')
  .and('have.attr', 'target', '_blank');
  })

  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
  cy.contains('a', 'Política de Privacidade').invoke('removeAttr','target').click();

  cy.contains('h1','CAC TAT - Política de privacidade').should('be.visible');
  })

  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
    .invoke('show')
    .should('be.visible')
    .and('contain','Mensagem enviada com sucesso.');

    cy.get('.success')
    .invoke('hide')
    .should('not.be.visible');
    
    cy.get('.error')
    .invoke('show')
    .should('be.visible')
    .and('contain','Valide os campos obrigatórios!');
    
    cy.get('.error')
    .invoke('hide')
    .should('not.be.visible');
  })

  it('preenche o campo da área de texto usando o comando invoke.', () => {
    const longText = Cypress._.repeat('Lorem ipsum dolor sit amet', 5);
    
    cy.get('#open-text-area')
    .invoke('val', longText)
    .should('have.value', longText);
  })  
  
  it('faz uma requisição HTTP', () => {
      cy.request('GET','https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html')
      
      .then(res => {
        expect(res.status).to.eq(200);
        expect(res.statusText).to.eq('OK');
        expect(res.body).to.include('CAC TAT');
      });
  })

  it('Ache o gato', () => {
    cy.get('#cat')
    .invoke('show')
    .should('be.visible');
    cy.get('#title')
    .invoke('text', 'CAT TAT');
    cy.get('#subtitle')
    .invoke('text','I love cats!');
  })
})
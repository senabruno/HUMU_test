describe('Testes Funcionais da API', () => {
  it('TC-04: Criar produto e validar dados retornados', () => {
    const newProduct = {
      title: 'Cypress Test Product',
      description: 'Product created by Cypress test',
      price: 99.99,
      brand: 'Cypress Labs',
      category: 'electronics'
    };

    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/products/add',
      body: newProduct
    }).then((response) => {
      expect(response.status).to.eq(201);

      expect(response.body.title).to.eq(newProduct.title);
      expect(response.body.description).to.eq(newProduct.description);
      expect(response.body.price).to.eq(newProduct.price);
      expect(response.body.brand).to.eq(newProduct.brand);
      expect(response.body.category).to.eq(newProduct.category);

      expect(response.body.id).to.be.a('number');
    });
  });

  it('TC-05: Criar produto sem autenticação é aceito', () => {
    cy.request({
      method: 'POST',
      url: 'https://dummyjson.com/products/add',
      body: {
        title: 'Produto sem token',
        price: 10
      }
    }).then((response) => {
      expect(response.status).to.eq(201);
    });
  });
});
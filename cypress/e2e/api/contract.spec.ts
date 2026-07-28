import Ajv from 'ajv';

describe('Validação de Contrato da API', () => {
  const ajv = new Ajv();

  const productSchema = {
    type: 'object',
    required: [
      'id', 'title', 'description', 'price', 'discountPercentage',
      'rating', 'stock', 'brand', 'category', 'thumbnail', 'images'
    ],
    properties: {
      id: { type: 'number' },
      title: { type: 'string' },
      description: { type: 'string' },
      price: { type: 'number' },
      discountPercentage: { type: 'number' },
      rating: { type: 'number' },
      stock: { type: 'number' },
      brand: { type: 'string' },
      category: { type: 'string' },
      thumbnail: { type: 'string' },
      images: {
        type: 'array',
        items: { type: 'string' }
      }
    }
  };

  const validate = ajv.compile(productSchema);

  it('TC-01: GET /products/1 deve validar o schema', () => {
    cy.request('GET', 'https://dummyjson.com/products/1').then((response) => {
      expect(response.status).to.eq(200);

      const isValid = validate(response.body);
      expect(isValid, `Schema inválido: ${JSON.stringify(validate.errors)}`).to.be.true;

      expect(response.body.id).to.be.a('number');
      expect(response.body.title).to.be.a('string');
      expect(response.body.price).to.be.a('number');
      expect(response.body.images).to.be.an('array');
    });
  });

  it('TC-02: GET /products deve validar todos os itens da lista', () => {
    cy.request('GET', 'https://dummyjson.com/products?limit=10').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.all.keys(['products', 'total', 'skip', 'limit']);

      response.body.products.forEach((product: any) => {
        const isValid = validate(product);
        expect(isValid, `Produto ${product.id} inválido: ${JSON.stringify(validate.errors)}`).to.be.true;
      });
    });
  });

  it('TC-03: GET /products/99999 deve retornar 404', () => {
    cy.request({
      method: 'GET',
      url: 'https://dummyjson.com/products/99999',
      failOnStatusCode: false
    }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.have.property('message');
    });
  });
});
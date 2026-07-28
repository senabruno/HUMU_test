Feature: Busca de Produtos

  @smoke
  Scenario: Busca com resposta lenta
    When I will search for "phone"
    Then I should receive products

  @q2.2b @error
  Scenario: Falha na API com status 500
    When I trigger a request to httpbin status 500
    Then I should receive a 500 status code

  @q2.2c @empty
  Scenario: Nenhum resultado com JSON customizado
    When I search for "xyz123" and receive empty results
    Then I should see "No products found" message
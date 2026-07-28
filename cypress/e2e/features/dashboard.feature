Feature: Dashboard - Paginação e Filtros

  @q2.3
  Scenario: Paginação funciona corretamente
    When I open the product dashboard
    And I am on page 1
    And I click on page 2
    Then the displayed products should match the API response for page 2

  @q2.3
  Scenario: Filtro por categoria funciona
    When I open the product dashboard
    And I select the category "beauty"
    Then all displayed products should be from category "beauty"
    And the product count should match the API response
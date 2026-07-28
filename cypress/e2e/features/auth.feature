Feature: Autenticação e Gerenciamento de Sessão

  Background:
    Given I am on the login page

  @critical @smoke @q2.1
  Scenario: Login com credenciais válidas via UI
    When I login with "michaelw" and "michaelwpass"
    Then I should be redirected to the profile page
    And the token should be stored in localStorage

  @critical @bypass @q2.1
  Scenario: Login via API com bypass da UI
    Given I am authenticated via API with "michaelw" and "michaelwpass"
    And I have a valid token in localStorage
    When I visit the profile page directly
    Then I should see my profile information
    And the token should persist after reload

  @negative @security
  Scenario: Credenciais inválidas
    When I login with invalid credentials
    Then I should see an error message
    And the error message should contain "Invalid"
    And I should remain on the login page
    And I should not be authenticated

  @negative @security
  Scenario: Acesso a página protegida sem token
    When I clear the authentication token
    And I visit the profile page directly
    Then I should be redirected to the login page
    And the session should be invalid and redirect to login

  @persistence @q2.1
  Scenario: Sessão persiste após recarregar
    When I login with "michaelw" and "michaelwpass"
    Then I should be redirected to the profile page
    When I reload the page
    Then I should see my profile information
    And the token should persist after reload
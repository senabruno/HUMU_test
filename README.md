# Humu Senior QA Challenge - Product Dashboard Tests

Projeto de automação de testes para o desafio técnico da Humu, utilizando Cypress com Cucumber, TypeScript e boas práticas de automação. A suíte contempla testes de autenticação, busca, paginação, filtros, validação de contrato de API e fluxos funcionais.

**SUT:** Product Dashboard (aplicação React com autenticação e catálogo de produtos)

---

## Como Executar os Testes

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
git clone https://github.com/senabruno/HUMU_test.git
cd HUMU_test
npm install
```

### Comandos
```bash
# Todos os testes
npx cypress run

# Com navegador visível
npx cypress run --headed

# Apenas features (Cucumber)
npx cypress run --spec "cypress/e2e/features/**/*.feature"

# Apenas testes de API
npx cypress run --spec "cypress/e2e/api/**/*.spec.ts"

# Modo interativo (debug)
npx cypress open
```

Padrões utilizados: Page Objects, Custom Commands, BDD com Cucumber, Fixtures.

Por que Cypress? Setup rápido, interceptação de rede (cy.intercept()), suporte nativo a TypeScript e Cucumber, comunidade ativa.

## Estratégia de Teste Regressivo (Q1.1)

### Smoke (críticos)
- Login com credenciais válidas
- Busca básica
- Carregamento do dashboard
- Validação de contrato da API

### Regressão completa
- Login via API (bypass)
- Persistência de sessão
- Busca com resposta lenta, erro 500 e resultado vazio
- Paginação e filtros
- Testes de API

### Prioridades
| Risco | Impacto |
|-------|---------|
| Falha na autenticação | Crítico |
| Inconsistência no contrato da API | Alto |
| Falha na busca/paginação | Médio |
| Erro 500 não tratado | Médio |

---

## Cenários de borda (Q1.2)

1. **Token expirado** – simular com `cy.clock()` e validar redirecionamento.
2. **Manipulação do localStorage** – modificar tokens e verificar rejeição.
3. **Latência de rede** – adicionar delay com `cy.intercept()` e validar loading.

---

## Rastreabilidade (Q1.3)

- Tags: `@critical`, `@smoke`, `@q2.1`, `@q2.2`
- Features em Gherkin como documentação executável
- Revisão de cobertura a cada sprint

---

## Segurança (Q3.3)

- Injeção: testar parâmetros com caracteres especiais
- BOLA: tentar acessar recursos de outros usuários
- Autenticação: testar endpoints sem token, com token inválido e expirado

## Performance (Q3.3)

- Tempo de resposta (p95): ideal < 2s
- Throughput: capacidade de escalabilidade
- Taxa de erro (5xx): estabilidade da API

---

## Escalabilidade (Q4.3)

| Estratégia | Como aplicar |
|------------|--------------|
| Paralelização | `--parallel` no Cypress |
| Retries | `retries: { runMode: 2 }` |
| Isolamento de dados | `cy.fixture()` e `cy.request()` |
| Execução seletiva | Tags como `@smoke` |

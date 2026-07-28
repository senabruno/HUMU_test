## Bug Report - Q4.2

**Título:** API não persiste produtos criados

**Descrição:** Ao criar um produto via POST /products/add, a API retorna um ID e status 201, mas o recurso não fica disponível para consulta via GET.

**Passos para reproduzir:**
1. Executar POST para https://dummyjson.com/products/add com dados válidos
2. Anotar o ID retornado (ex: 195)
3. Executar GET para https://dummyjson.com/products/{id}
4. A API retorna 404 - Product not found

**Resultado esperado:** O produto criado deveria estar disponível para consulta.

**Resultado atual:** A API retorna 404, indicando que o produto não foi persistido.

**Impacto:** Médio. Impossibilita validação de fluxos completos de criação e consulta em testes.

**Sugestão de correção:** Utilizar uma API que persista os dados em ambiente de testes, ou implementar um mock que simule a persistência.

---

---

## Comandos utilizados para reproduzir

**1. Criar o produto (POST)**

```powershell
Invoke-RestMethod -Uri "https://dummyjson.com/products/add" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"title":"Produto Teste","price":100}'
```

**2. Tentar buscar o produto criado (GET)**

```powershell
Invoke-RestMethod -Uri "https://dummyjson.com/products/195" -Method GET
```

**3. Resposta obtida da API**

```json
{"message":"Product with id '195' not found"}
```

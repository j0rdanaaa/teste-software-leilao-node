# Testes de Unidade

Nesta pasta estão os testes de unidade da aplicação, desenvolvidos utilizando o **Jest**.

Os testes verificam de forma isolada o comportamento das classes `UserDAO` e `AuctionDAO`, utilizando **mocks do banco de dados** com `jest.fn()`.

## Arquivos de teste

- `userDAO.test.js`: testes relacionados às operações de usuários.
- `auctionDAO.test.js`: testes relacionados às operações de leilões e lances.

## Executando os testes de unidade

Para executar apenas os testes desta pasta, utilize:

```bash
npm test -- tests/unit
```

Os testes unitários verificam cenários de sucesso e de erro sem utilizar diretamente o banco de dados SQLite.
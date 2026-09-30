# Testes de Integração

Nesta pasta estão os testes de integração da aplicação, desenvolvidos utilizando o **Jest**.

Os testes verificam a integração entre os componentes da aplicação e o banco de dados **SQLite**, utilizando o banco real em vez de mocks.

## Arquivo de teste

- `integration.test.js`: realiza testes envolvendo usuários, leilões e lances.

Os testes verificam operações como:

- cadastro e consulta de usuário;
- criação de leilão;
- registro de lance;
- consulta dos lances de um leilão.

Antes da execução de cada teste, os dados utilizados são limpos para evitar conflitos entre diferentes execuções.

## Executando os testes de integração

Para executar apenas os testes desta pasta, utilize:

```bash id="nhd6dv"
npm test -- tests/integrated
```

Dessa forma, é possível verificar o funcionamento conjunto dos DAOs e do banco de dados SQLite.
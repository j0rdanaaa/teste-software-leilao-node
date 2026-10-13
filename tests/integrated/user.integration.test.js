
const sqlite3 = require('sqlite3').verbose();
const { UserDAO } = require('../../src/userDAO');

describe('Teste de integração - UserDAO', () => {
    let db;
    let userDAO;

    beforeEach(async () => {
        db = new sqlite3.Database(':memory:');

        await new Promise((resolve, reject) => {
            db.run(
                `CREATE TABLE users (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                )`,
                (err) => err ? reject(err) : resolve()
            );
        });

        userDAO = new UserDAO(db);
    });

    afterEach(async () => {
        await new Promise((resolve, reject) => {
            db.close((err) => err ? reject(err) : resolve());
        });
    });

    test('deve cadastrar e buscar um usuário no banco real', async () => {
        await userDAO.addUser({
            id: 1,
            name: 'Alice'
        });

        const user = await userDAO.getUserById(1);

        expect(user).toEqual({
            id: 1,
            name: 'Alice'
        });
    });
});

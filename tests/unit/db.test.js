
jest.mock('sqlite3', () => {
    const mockDb = {
        serialize: jest.fn(callback => callback()),
        run: jest.fn()
    };

    return {
        verbose: jest.fn(() => ({
            Database: jest.fn(() => mockDb)
        }))
    };
});

const sqlite3 = require('sqlite3');

describe('Configuração do banco de dados', () => {
    test('deve criar as três tabelas do sistema', () => {
        const db = require('../../src/db');

        expect(sqlite3.verbose).toHaveBeenCalledTimes(1);
        expect(db.serialize).toHaveBeenCalledTimes(1);
        expect(db.run).toHaveBeenCalledTimes(3);

        const comandos = db.run.mock.calls.map(call => call[0]);

        expect(comandos[0]).toContain('CREATE TABLE IF NOT EXISTS users');
        expect(comandos[1]).toContain('CREATE TABLE IF NOT EXISTS auctions');
        expect(comandos[2]).toContain('CREATE TABLE IF NOT EXISTS bids');
    });
});

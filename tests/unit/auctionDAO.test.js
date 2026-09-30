const { AuctionDAO } = require('../../src/auctionDAO');

describe('AuctionDAO (mock)', () => {

    test('deve criar um leilão com sucesso', async () => {

        // mock do banco de dados
        const mockDb = {
            run: jest.fn((stmt, params, callback) => {
                callback.call({ changes: 1 }, null);
            })
        };

        const auctionDAO = new AuctionDAO(mockDb);

        const auction = {
            id: 1,
            name: 'Notebook',
            startingPrice: 1000
        };

        const result = await auctionDAO.createAuction(auction);

        expect(mockDb.run).toHaveBeenCalled();

        expect(result).toEqual({
            changes: 1
        });
    });
test('deve retornar leilão pelo ID', async () => {

    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, {
                id: 1,
                name: 'Notebook',
                startingPrice: 1000
            });
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    const result = await auctionDAO.getAuctionById(1);

    expect(mockDb.get).toHaveBeenCalled();

    expect(result).toEqual({
        id: 1,
        name: 'Notebook',
        startingPrice: 1000
    });
});
test('deve rejeitar lance menor ou igual ao preço inicial', async () => {

    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, {
                id: 1,
                name: 'Notebook',
                startingPrice: 1000
            });
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.placeBid(1, 1, 500)
    ).rejects.toThrow(
        'O valor do lance deve ser maior do que o preço inicial.'
    );
});
test('deve rejeitar lance quando o leilão não existir', async () => {

    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, null);
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.placeBid(999, 1, 1500)
    ).rejects.toThrow('Auction not found.');
});
test('deve rejeitar lance com valor suspeito', async () => {

    const mockDb = {};

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.placeBid(1, 1, 1000001)
    ).rejects.toThrow('Suspicious bid amount');
});
test('deve registrar um lance válido com sucesso', async () => {

    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, {
                id: 1,
                name: 'Notebook',
                startingPrice: 1000
            });
        }),

        run: jest.fn((stmt, params, callback) => {
            callback.call({ lastID: 1 }, null);
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    const result = await auctionDAO.placeBid(1, 1, 1500);

    expect(mockDb.get).toHaveBeenCalled();
    expect(mockDb.run).toHaveBeenCalled();

    expect(result).toEqual({
        id: 1,
        auctionId: 1,
        userId: 1,
        amount: 1500
    });
});
test('deve retornar os lances de um leilão', async () => {

    const mockDb = {
        all: jest.fn((stmt, params, callback) => {
            callback(null, [
                {
                    id: 1,
                    auctionId: 1,
                    userId: 1,
                    amount: 1500
                },
                {
                    id: 2,
                    auctionId: 1,
                    userId: 2,
                    amount: 1800
                }
            ]);
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    const result = await auctionDAO.getBidsForAuction(1);

    expect(mockDb.all).toHaveBeenCalled();

    expect(result).toEqual([
        {
            id: 1,
            auctionId: 1,
            userId: 1,
            amount: 1500
        },
        {
            id: 2,
            auctionId: 1,
            userId: 2,
            amount: 1800
        }
    ]);
});
});
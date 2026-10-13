
const { AuctionDAO } = require('../../src/auctionDAO');

describe('AuctionDAO (mock)', () => {

    test('deve criar um leilão com sucesso', async () => {
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
        expect(result).toEqual({ changes: 1 });
    });
    
test('deve retornar um leilão pelo ID', async () => {
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

    expect(mockDb.get).toHaveBeenCalledWith(
        expect.any(String),
        [1],
        expect.any(Function)
    );

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
        }),
        run: jest.fn()
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.placeBid(1, 2, 900)
    ).rejects.toThrow(
        'O valor do lance deve ser maior do que o preço inicial.'
    );

    expect(mockDb.run).not.toHaveBeenCalled();
});

test('deve rejeitar lance quando o leilão não existir', async () => {
    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, null);
        }),
        run: jest.fn()
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.placeBid(999, 2, 1500)
    ).rejects.toThrow('Auction not found.');

    expect(mockDb.run).not.toHaveBeenCalled();
});

test('deve rejeitar lance com valor suspeito', async () => {
    const mockDb = {
        get: jest.fn(),
        run: jest.fn()
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.placeBid(1, 2, 1500000)
    ).rejects.toThrow('Suspicious bid amount');

    expect(mockDb.get).not.toHaveBeenCalled();
    expect(mockDb.run).not.toHaveBeenCalled();
});

test('deve registrar um lance válido', async () => {
    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, {
                id: 1,
                name: 'Notebook',
                startingPrice: 1000
            });
        }),

        run: jest.fn((stmt, params, callback) => {
            callback.call({ lastID: 10 }, null);
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    const result = await auctionDAO.placeBid(1, 2, 1500);

    expect(mockDb.run).toHaveBeenCalledWith(
        expect.any(String),
        [1, 2, 1500],
        expect.any(Function)
    );

    expect(result).toEqual({
        id: 10,
        auctionId: 1,
        userId: 2,
        amount: 1500
    });
});

test('deve retornar os lances de um leilão', async () => {
    const mockDb = {
        all: jest.fn((stmt, params, callback) => {
            callback(null, [
                { id: 1, auctionId: 1, userId: 2, amount: 1500 },
                { id: 2, auctionId: 1, userId: 3, amount: 1800 }
            ]);
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    const result = await auctionDAO.getBidsForAuction(1);

    expect(mockDb.all).toHaveBeenCalledWith(
        expect.any(String),
        [1],
        expect.any(Function)
    );

    expect(result).toEqual([
        { id: 1, auctionId: 1, userId: 2, amount: 1500 },
        { id: 2, auctionId: 1, userId: 3, amount: 1800 }
    ]);
});

test('deve rejeitar quando o banco falhar ao criar leilão', async () => {
    const mockDb = {
        run: jest.fn((stmt, params, callback) => {
            callback(new Error('Erro ao criar leilão'));
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    const auction = {
        id: 1,
        name: 'Notebook',
        startingPrice: 1000
    };

    await expect(
        auctionDAO.createAuction(auction)
    ).rejects.toThrow('Erro ao criar leilão');
});

test('deve rejeitar quando o banco falhar ao buscar leilão', async () => {
    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(new Error('Erro ao buscar leilão'));
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.getAuctionById(1)
    ).rejects.toThrow('Erro ao buscar leilão');
});

test('deve rejeitar quando o banco falhar ao consultar lances', async () => {
    const mockDb = {
        all: jest.fn((stmt, params, callback) => {
            callback(new Error('Erro ao consultar lances'));
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.getBidsForAuction(1)
    ).rejects.toThrow('Erro ao consultar lances');
});

test('deve rejeitar quando o banco falhar ao registrar lance', async () => {
    const mockDb = {
        get: jest.fn((stmt, params, callback) => {
            callback(null, {
                id: 1,
                name: 'Notebook',
                startingPrice: 1000
            });
        }),

        run: jest.fn((stmt, params, callback) => {
            callback(new Error('Erro ao registrar lance'));
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    await expect(
        auctionDAO.placeBid(1, 2, 1500)
    ).rejects.toThrow('Erro ao registrar lance');
});

test('deve retornar lista vazia quando não houver lances', async () => {
    const mockDb = {
        all: jest.fn((stmt, params, callback) => {
            callback(null, null);
        })
    };

    const auctionDAO = new AuctionDAO(mockDb);

    const result = await auctionDAO.getBidsForAuction(1);

    expect(result).toEqual([]);
});


});

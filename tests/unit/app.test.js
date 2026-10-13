
jest.mock('../../src/user', () => ({
    addUser: jest.fn().mockResolvedValue({ changes: 1 }),
    getUserById: jest.fn().mockResolvedValue({
        id: 2,
        name: 'Bob'
    })
}));

jest.mock('../../src/auction', () => ({
    createAuction: jest.fn().mockResolvedValue({ changes: 1 }),
    getAuctionById: jest.fn().mockResolvedValue({
        id: 1,
        name: 'Leilão de arte',
        startingPrice: 100
    }),
    placeBid: jest.fn().mockResolvedValue({
        id: 1,
        auctionId: 1,
        userId: 2,
        amount: 120
    }),
    getBidsForAuction: jest.fn().mockResolvedValue([
        {
            id: 1,
            auctionId: 1,
            userId: 2,
            amount: 120
        }
    ])
}));

const { addUser, getUserById } = require('../../src/user');
const {
    createAuction,
    getAuctionById,
    placeBid,
    getBidsForAuction
} = require('../../src/auction');

test('deve executar o fluxo principal da aplicação', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    try {
        jest.isolateModules(() => {
            require('../../src/app');
        });

        await new Promise(resolve => setImmediate(resolve));

        expect(addUser).toHaveBeenCalledTimes(2);
        expect(addUser).toHaveBeenCalledWith({ id: 1, name: 'Alice' });
        expect(addUser).toHaveBeenCalledWith({ id: 2, name: 'Bob' });

        expect(createAuction).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 1,
                startingPrice: 100
            })
        );

        expect(placeBid).toHaveBeenCalledWith(1, 2, 120);
        expect(getUserById).toHaveBeenCalledWith(2);
        expect(getAuctionById).toHaveBeenCalledWith(1);
        expect(getBidsForAuction).toHaveBeenCalledWith(1);

        expect(consoleSpy).toHaveBeenCalledTimes(3);
    } finally {
        consoleSpy.mockRestore();
    }
});

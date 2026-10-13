
jest.mock('../../src/db', () => ({}));

jest.mock('../../src/auctionDAO', () => ({
    AuctionDAO: jest.fn().mockImplementation(() => ({
        createAuction: jest.fn().mockResolvedValue({ changes: 1 }),
        getAuctionById: jest.fn().mockResolvedValue({
            id: 1,
            name: 'Notebook',
            startingPrice: 1000
        }),
        getBidsForAuction: jest.fn().mockResolvedValue([]),
        placeBid: jest.fn().mockResolvedValue({
            id: 10,
            auctionId: 1,
            userId: 2,
            amount: 1500
        })
    }))
}));

const {
    createAuction,
    getAuctionById,
    getBidsForAuction,
    placeBid
} = require('../../src/auction');

describe('Auction', () => {

    test('deve criar um leilão', async () => {
        const auction = {
            id: 1,
            name: 'Notebook',
            startingPrice: 1000
        };

        const result = await createAuction(auction);

        expect(result).toEqual({ changes: 1 });
    });

    test('deve buscar um leilão pelo ID', async () => {
        const result = await getAuctionById(1);

        expect(result).toEqual({
            id: 1,
            name: 'Notebook',
            startingPrice: 1000
        });
    });

    test('deve retornar os lances de um leilão', async () => {
        const result = await getBidsForAuction(1);

        expect(result).toEqual([]);
    });

    test('deve registrar um lance', async () => {
        const result = await placeBid(1, 2, 1500);

        expect(result).toEqual({
            id: 10,
            auctionId: 1,
            userId: 2,
            amount: 1500
        });
    });

});

const db = require('../../src/db');
const { UserDAO } = require('../../src/userDAO');
const { AuctionDAO } = require('../../src/auctionDAO');

describe('UserDAO - Teste de Integração', () => {

    const userDAO = new UserDAO(db);
    const auctionDAO = new AuctionDAO(db);

   beforeEach((done) => {
    db.serialize(() => {
        db.run('DELETE FROM bids');
        db.run('DELETE FROM auctions WHERE id = ?', [100]);
        db.run('DELETE FROM users WHERE id = ?', [100], done);
    });
});

    test('deve adicionar e buscar um usuário no banco de dados', async () => {

        const user = {
            id: 100,
            name: 'Maria'
        };

        await userDAO.addUser(user);

        const result = await userDAO.getUserById(100);

        expect(result).toEqual({
            id: 100,
            name: 'Maria'
        });
    });
    test('deve criar usuário, leilão e registrar um lance', async () => {

    // cria um usuário no banco
    await userDAO.addUser({
        id: 100,
        name: 'Maria'
    });

    // cria um leilão no banco
    await auctionDAO.createAuction({
        id: 100,
        name: 'Notebook',
        startingPrice: 1000
    });

    // registra um lance
    const bid = await auctionDAO.placeBid(
        100,
        100,
        1500
    );

    // busca os lances do leilão
    const bids = await auctionDAO.getBidsForAuction(100);

    expect(bid.auctionId).toBe(100);
    expect(bid.userId).toBe(100);
    expect(bid.amount).toBe(1500);

    expect(bids).toHaveLength(1);

    expect(bids[0].auctionId).toBe(100);
    expect(bids[0].userId).toBe(100);
    expect(bids[0].amount).toBe(1500);
});

});
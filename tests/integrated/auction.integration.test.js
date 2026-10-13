
const sqlite3 = require('sqlite3').verbose();
const { UserDAO } = require('../../src/userDAO');
const { AuctionDAO } = require('../../src/auctionDAO');

describe('Teste de integração - Leilões e Lances', () => {
    let db;
    let userDAO;
    let auctionDAO;

    beforeEach(async () => {
        db = new sqlite3.Database(':memory:');

        await new Promise((resolve, reject) => {
            db.exec(`
                CREATE TABLE users (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL
                );

                CREATE TABLE auctions (
                    id INTEGER PRIMARY KEY,
                    name TEXT NOT NULL,
                    starting_price REAL NOT NULL
                );

                CREATE TABLE bids (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    auction_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    amount REAL NOT NULL,
                    FOREIGN KEY (auction_id) REFERENCES auctions(id),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                );
            `, (err) => err ? reject(err) : resolve());
        });

        userDAO = new UserDAO(db);
        auctionDAO = new AuctionDAO(db);
    });

    afterEach(async () => {
        await new Promise((resolve, reject) => {
            db.close((err) => err ? reject(err) : resolve());
        });
    });

    test('deve cadastrar usuário, criar leilão e registrar lance', async () => {
        await userDAO.addUser({
            id: 1,
            name: 'Alice'
        });

        await auctionDAO.createAuction({
            id: 1,
            name: 'Notebook',
            startingPrice: 1000
        });

        const auction = await auctionDAO.getAuctionById(1);

        expect(auction).toEqual({
            id: 1,
            name: 'Notebook',
            startingPrice: 1000
        });

        const bid = await auctionDAO.placeBid(1, 1, 1500);

        expect(bid).toEqual({
            id: expect.any(Number),
            auctionId: 1,
            userId: 1,
            amount: 1500
        });

        const bids = await auctionDAO.getBidsForAuction(1);

        expect(bids).toHaveLength(1);
        expect(bids[0]).toEqual(bid);
    });
});

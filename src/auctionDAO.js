

class AuctionDAO {
    constructor(db){ this.db = db }


    createAuction(auction) {
        return new Promise((resolve, reject) => {
            const stmt = `INSERT INTO auctions(id, name, starting_price) VALUES(?, ?, ?)`;
            this.db.run(stmt, [auction.id, auction.name, auction.startingPrice], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ changes: this.changes });
            });
        });
    }


    getAuctionById(id){
        return new Promise((resolve, reject) => {
            const stmt = `SELECT id, name, starting_price as startingPrice FROM auctions WHERE id = ?`;
            this.db.get(stmt, [id], (err, row) => {
                if (err) {
                    return reject(err);
                }
                resolve(row || null);
            });
        });
    }


    getBidsForAuction(auctionId){
        return new Promise((resolve, reject) => {
            const stmt = `SELECT id, auction_id as auctionId, user_id as userId, amount FROM bids WHERE auction_id = ? ORDER BY id ASC`;
            this.db.all(stmt, [auctionId], (err, rows) => {
                if (err) {
                    return reject(err);
                }
                resolve(rows || []);
            });
        });
    }


    async placeBid(auctionId, userId, amount){

        if (amount > 1000000) {
            throw new Error('Suspicious bid amount');
        }


        const auction = await this.getAuctionById(auctionId);
        if (!auction) {
            throw new Error('Auction not found.');
        }


        if (amount <= auction.startingPrice) {
            throw new Error('O valor do lance deve ser maior do que o preço inicial.');
        }


        return new Promise((resolve, reject) => {
            const stmt = `INSERT INTO bids(auction_id, user_id, amount) VALUES(?, ?, ?)`;
            this.db.run(stmt, [auctionId, userId, amount], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve({ id: this.lastID, auctionId, userId, amount });
            });
        });
    }
}


module.exports = { AuctionDAO };

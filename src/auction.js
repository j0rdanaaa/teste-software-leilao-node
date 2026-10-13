const db = require('./db');
const { AuctionDAO } = require('./auctionDAO');
const auctionDAO = new AuctionDAO(db);


function createAuction(auction){
    return auctionDAO.createAuction(auction);
}


function getAuctionById(id){
    return auctionDAO.getAuctionById(id);
}


function getBidsForAuction(auctionId){
    return auctionDAO.getBidsForAuction(auctionId);
}


function placeBid(auctionId, userId, amount){
    return auctionDAO.placeBid(auctionId, userId, amount);
}


module.exports = {
    createAuction,
    getAuctionById,
    placeBid,
    getBidsForAuction
};

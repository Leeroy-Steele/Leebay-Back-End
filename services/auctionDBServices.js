
const { query } = require("express")
const sqlFile = require("../dbconfig/db.config")
const sql = sqlFile.mysqlConnectionDetails

let addAuctionItem = async (
    seller_user_id,
    highest_bidder_id,
    category,
    image_path,
    auction_title,
    item_location,
    item_description,
    current_price,
    end_date
    )=>{

    return new Promise((resolve, reject) => {
        let sqlQuery1 = `INSERT INTO auction_items (
            seller_user_id,
            highest_bidder_id,
            category,
            image_path,
            auction_title,
            item_location,
            item_description,
            current_price,
            end_date
            )
            VALUES(
                ${seller_user_id},
                ${highest_bidder_id},
                "${category}",
                "${image_path}",
                "${auction_title}",
                "${item_location}",
                "${item_description}",
                    ${current_price},
                "${end_date}"  
            )`;
        ``
        sql.query(sqlQuery1, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
        });

});}

let storeImageURLToDatabase=async(fileName,auction_id)=>{

    return new Promise((resolve, reject) => {

        let sqlQuery = `UPDATE auction_items SET image_path='${fileName}' WHERE auction_id =${auction_id}`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
        });
    });
}

let deleteAuctionItem = async (auction_id)=>{

    return new Promise((resolve, reject) => {
        let sqlQuery = `DELETE FROM auction_items WHERE auction_id="${auction_id}"`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
        });
    });
}

let findAllAuctionItems = async ()=>{

    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT * FROM auction_items`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
            
        });
    });

}

let findAllAuctionItemsByUserID = async (user_id)=>{

    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT * FROM auction_items WHERE seller_user_id=${user_id}`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
            
        });
    });

}

let findAuctionItem = async (auction_id)=>{

    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT * FROM auction_items WHERE auction_id=${auction_id}`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
            
        });
    });
}

let placeBid = async (auction_id,bidder_id,bidder_userName,bid)=>{ 

    return new Promise((resolve, reject) => {

        let sqlQuery1 = `INSERT INTO bid_register VALUES(${auction_id},${bidder_id},'${bidder_userName}',${bid})`;  // update bid register
        
        sql.query(sqlQuery1, (err, result, field) => {
 
            if(err) {return reject(err)}
            
        });

        let sqlQuery2 = `UPDATE auction_items SET current_price=${bid},highest_bidder_id=${bidder_id} WHERE auction_id =${auction_id}`; // update auction bid price
        
        sql.query(sqlQuery2, (err, result, field) => {
            if(err) {return reject(err)}
            
            resolve(Object.values(result));
            
        });
    });
} 

//// expired auction table actions

let findExpiredAuctionItems = async ()=>{

    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT * FROM auction_items WHERE end_date <= CURRENT_TIMESTAMP`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err){
                return reject(err);
            }
            else{
                return resolve(Object.values(result));
   
            }
        });
    });
}

let insertClosedAuctionItem = async (item)=>{

    let auction_id = item.auction_id                //from auction item table
    let seller_user_id = item.seller_user_id

    let seller_user_name = item.seller_user_name    //from user table
    let seller_email = item.seller_email

    let highest_bidder_id = item.highest_bidder_id  //from auction item table
    let category = item.category
    let image_path = item.image_path
    let auction_title = item.auction_title
    let item_location = item.item_location
    let item_description = item.item_description
    let sold_price = item.current_price
    let end_date = item.end_date.toISOString().replace(/T/, ' ').replace(/\..+/, '')

    return new Promise((resolve, reject) => {
        let sqlQuery3 = `INSERT INTO closed_auction_items
                            VALUES(
                                ${auction_id},
                                ${seller_user_id},

                                "${seller_user_name}",
                                "${seller_email}",

                                ${highest_bidder_id},
                                "${category}",
                                "${image_path}",
                                "${auction_title}",
                                "${item_location}",
                                "${item_description}",
                                 ${sold_price},
                                "${end_date}"  
                            )`;
        
        sql.query(sqlQuery3, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
        });

});}

let findAllWonAuctionsByUser = async (highest_bidder_id)=>{

    if (highest_bidder_id!= "null" && highest_bidder_id!="undefined"){

        return new Promise((resolve, reject) => {
            let sqlQuery = `SELECT * FROM closed_auction_items WHERE highest_bidder_id=${highest_bidder_id}`;
            
            sql.query(sqlQuery, (err, result, field) => {
                if(err) return reject(err);
                
                resolve(Object.values(result));
                
            });
        });

    }
    else{

        return 'Specify highest bidder id'

    }


}

let findExpiredAuctionItem = async (auction_id)=>{

    if (auction_id!= "null" && auction_id!="undefined"){

        return new Promise((resolve, reject) => {
            let sqlQuery = `SELECT * FROM closed_auction_items WHERE auction_id=${auction_id}`;
            
            sql.query(sqlQuery, (err, result, field) => {
                if(err) return reject(err);
                
                resolve(Object.values(result));
                
            });
        });

    }
    else{

        return 'Specify Auction_id'

    }


}

let deleteExpiredAuctionItem = async (auction_id)=>{

    return new Promise((resolve, reject) => {
        let sqlQuery = `DELETE FROM closed_auction_items WHERE auction_id="${auction_id}"`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
        });
    });
}

//// bidder register table actions

let findAuctionsFromRegistoryByBidder = async(bidder_id)=>{
    
    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT * FROM bid_register WHERE bidder_id=${bidder_id} `;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(result);
            
        });
    });
}

let getAuctionBids = async(auction_id)=>{
    
    return new Promise((resolve, reject) => {
        let sqlQuery = `SELECT * FROM bid_register WHERE auction_id=${auction_id} `;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(result);
            
        });
    });
}


//// export here
 
module.exports = {

    addAuctionItem,
    deleteAuctionItem,
    findAllAuctionItems,
    findExpiredAuctionItems,
    findExpiredAuctionItem,
    insertClosedAuctionItem,
    storeImageURLToDatabase,
    placeBid,
    getAuctionBids,
    findAuctionItem,
    deleteExpiredAuctionItem,
    findAllWonAuctionsByUser,
    findAllAuctionItemsByUserID,
    findAuctionsFromRegistoryByBidder
    
}





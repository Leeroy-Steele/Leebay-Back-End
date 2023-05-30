
const { query } = require("express")
const sqlFile = require("../dbconfig/db.config")
const sql = sqlFile.mysqlConnectionDetails


//// auction comments actions


let addAuctionComment = async (user_id,auction_id,comment_text)=>{
 
    return new Promise((resolve, reject) => {
        let sqlQuery = `
            INSERT INTO auction_comments (user_id,auction_id,comment_text)
            VALUES(${user_id},${auction_id},"${comment_text}" )`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
        });
    });
}

let deleteAllAuctionComments = async (auction_id)=>{

    return new Promise((resolve, reject) => {
        let sqlQuery = `DELETE FROM auction_comments WHERE auction_id="${auction_id}"`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
        });
    });
}


let findAllAuctionComments = async (auction_id)=>{

    return new Promise((resolve, reject) => {
        // let sqlQuery = `SELECT * FROM auction_comments WHERE auction_id=${auction_id}`;
        let sqlQuery = `SELECT users.user_name, auction_comments.comment_text FROM auction_comments 
        INNER JOIN users ON auction_comments.user_id = users.user_id WHERE auction_id=${auction_id}`;
        
        sql.query(sqlQuery, (err, result, field) => {
            if(err) return reject(err);
            
            resolve(Object.values(result));
            
        });
    });
}


//// export here
 
module.exports = {

    addAuctionComment,
    deleteAllAuctionComments,
    findAllAuctionComments
    
}





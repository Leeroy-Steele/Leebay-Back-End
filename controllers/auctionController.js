
const auction_dbServices = require('../services/auctionDBServices')

// for deleting images / files
const fs = require('fs');   
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)

//// Pass new image fileName to database here
const storeImageURLToDatabase=async(fileName,req)=>{

    let auction_id=req.query.auction_id
    auction_dbServices.storeImageURLToDatabase(fileName,auction_id)
}

//// auction_items table actions

const addAuctionItem = async (req,res)=>{

    let seller_user_id = req.body.seller_user_id
    let highest_bidder_id = req.body.highest_bidder_id
    let category = req.body.category
    let image_path = req.body.image_path

    let auction_title = req.body.auction_title
    let item_location = req.body.item_location
    let item_description = req.body.item_description
    let current_price = req.body.current_price
    let end_date = req.body.end_date

    let resp = auction_dbServices.addAuctionItem(    
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

    res.json(await resp)
    
}

const deleteAuctionItem = async (req,res)=>{

    //first decide if image should be deleted (If auction is being moved to expired auctions table then image stays)

    let deleteImage = req.body.delete_image
    let auction_id = req.body.auction_id

    // if yes then find image path

    if(deleteImage){
        
        let auctionItem = await auction_dbServices.findAuctionItem(auction_id)
        let imagePath = auctionItem[0].image_path
        let adjustedImagePath = './public/images/' + imagePath

        // then delete image from folder path (if it's not default auction image!)
        
        defaultImagePath = './public/images/noImagePicture.png'

        if(adjustedImagePath!==defaultImagePath){

            await unlinkAsync(adjustedImagePath)
        }
    }
    // then delete auction from db

    
    let resp = auction_dbServices.deleteAuctionItem(auction_id)

    if(res!==null){res.json(await resp)} //needed if called from controller directly
    
}

const findAllAuctionItems = async (req,res)=>{

    let user_id = req.query.user_id // both are currently logged in user
    let bidder_id = req.query.bidder_id // both are currently logged in user

    let resp

    if(user_id!==undefined){
        resp = auction_dbServices.findAllAuctionItemsByUserID(user_id)
        res.json(await resp)
    }
    else if(bidder_id!==undefined){
        // first get auction ids to retrieve from bid register
        let auctions = await auction_dbServices.findAuctionsFromRegistoryByBidder(bidder_id)
        
        // create set to store auction_ids
        let auctionIDs = new Set()
        for(let i in auctions){
            auctionIDs.add(auctions[i].auction_id)
        }

        // grab each auction item by id and add to resp array. canProceed controller when to send response
        resp = []
        let canProceed = 0

        auctionIDs.forEach(async (id)=>{
            let auction = await auction_dbServices.findAuctionItem(id)
            resp.push(auction[0])
            canProceed++
            if(canProceed===auctionIDs.size){
                res.json(resp)
            }
        })

    }
    else{
        resp = auction_dbServices.findAllAuctionItems()
        res.json(await resp)
    }

}

const findAuctionItem = async (req,res)=>{

    let auction_id = req.query.auction_id

    let resp = auction_dbServices.findAuctionItem(auction_id)

    if(res!==null){
        res.json(await resp)
    }
}

const placeBid = async (req,res)=>{

    let bidder_id = req.body.bidder_id
    let bidder_userName = req.body.bidder_userName
    let bid = req.body.bid
    let auction_id = req.body.auction_id



    let resp = auction_dbServices.placeBid(auction_id,bidder_id,bidder_userName,bid)
    res.json(await resp)
    
}
 
const getAuctionBids = async (req,res)=>{

    let auction_id = req.query.auction_id

    let resp = auction_dbServices.getAuctionBids(auction_id)
    res.json(await resp)
    
}

///////     retrieve expired auction for front end profile page

const findAllWonAuctionsByUser = async (req,res)=>{

    let highest_bidder_id = req.query.highest_bidder_id  
    let resp = auction_dbServices.findAllWonAuctionsByUser(highest_bidder_id)
    res.json(await resp)
    
}

const deleteExpiredAuction = async (req,res) => {

    // identify auction by id
    let auction_id = req.body.auction_id

    // find image path
    let auctionItem = await auction_dbServices.findExpiredAuctionItem(auction_id)
    let imagePath = auctionItem[0].image_path
    let adjustedImagePath = './public/images/' + imagePath

    // then delete image from folder path (if it's not default auction image!)
    defaultImagePath = './public/images/noImagePicture.png'

    if(adjustedImagePath!==defaultImagePath){
        await unlinkAsync(adjustedImagePath)
    }
    
    // then delete auction from db
    let resp = auction_dbServices.deleteExpiredAuctionItem(auction_id)
    res.json(await resp)
}

//// export here

module.exports = {
    storeImageURLToDatabase,
    addAuctionItem,
    deleteAuctionItem,
    findAllAuctionItems,
    placeBid,
    getAuctionBids,
    findAuctionItem,
    findAllWonAuctionsByUser,
    deleteExpiredAuction
    
}
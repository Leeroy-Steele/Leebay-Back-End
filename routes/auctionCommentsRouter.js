const express = require('express')
const router = express.Router()

// require controllers here

let auctionCommentsController = require('../controllers/auctionCommentsController')

//// auction comments actions

router.post('/add-auction-comment',(req,res)=>{

    auctionCommentsController.addAuctionComment(req,res)
})

router.delete('/delete-all-auction-comments',(req,res)=>{

    auctionCommentsController.deleteAllAuctionComments(req,res)
})

router.get('/find-all-auction-comments',(req,res)=>{

    auctionCommentsController.findAllAuctionComments(req,res)
})

module.exports = router
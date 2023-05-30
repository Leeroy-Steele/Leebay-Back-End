const express = require('express')
const router = express.Router()
const path = require('path');   // needed to serve images from image folder

// require controllers here

const auctionController = require('../controllers/auctionController')
require('../controllers/automatedController')

//// Multer starts here  (For image upload to auctions)

const multer = require("multer");

// This function will take the newly generated filename / path and upload it to the database
function storeImageURLToDatabase(fileName, req) {
  auctionController.storeImageURLToDatabase(fileName, req);
}

const upload = multer({
  storage: multer.diskStorage({

    // first define a folder to store the images
    destination: function (req, file, cb) {
        cb(null, "./public/images"); 
    },

    // next create a filename for image with date + random number
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9) + ".jpg";
        const fileName = file.fieldname + "-" + uniqueSuffix;
        cb(storeImageURLToDatabase(fileName, req), fileName);

    },
}),
  limits: {
    fileSize: 9000000,  // limit max file size here
  },

});

router.post('/add-auction-photo', upload.single('auctionImage'), (req, res, next) => {
    res.send('worked!')
    }, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


//// auction_items routes
router.get('/get-auction-image', async (req,res)=>{

    let fileName = req.query.fileName
    console.log(fileName)

    const options = {
		root: path.join(__dirname,"../public/images")
	};

	res.sendFile(fileName, options, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('Sent');
		}
	});
}) 

router.post('/add-auction-item',(req,res)=>{

    auctionController.addAuctionItem(req,res)
})

router.delete('/delete-auction-item',(req,res)=>{

    auctionController.deleteAuctionItem(req,res)
})

router.get('/find-all-auction-items',(req,res)=>{

    auctionController.findAllAuctionItems(req,res)
})

router.get('/find-auction-item',(req,res)=>{

    auctionController.findAuctionItem(req,res)
})

router.patch('/place-bid',(req,res)=>{ 

    auctionController.placeBid(req,res)
})

router.get('/auction-bids',(req,res)=>{

    auctionController.getAuctionBids(req,res)
})

//// expired auction_items table actions

router.get('/find-all-expired-auction-items',(req,res)=>{

    auctionController.findAllWonAuctionsByUser(req,res)
})

router.delete('/delete-expired-auction',(req,res)=>{

    auctionController.deleteExpiredAuction(req,res)
})

module.exports = router
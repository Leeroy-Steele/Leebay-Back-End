////   express generic setup
const express = require('express')
const app = express()
app.use(express.json());    // to access http request body


// stop CORS Browser error
let cors = require("cors"); 
app.use(cors());


// create a route to a static html page
app.use('/static', express.static('public'))
app.use(express.json())


//// import routes
const loginRouter = require('./routes/loginRouter')
app.use('/',loginRouter)

const auctionRouter = require('./routes/auctionRouter')
app.use('/',auctionRouter)

const auctionCommentsRouter = require('./routes/auctionCommentsRouter')
app.use('/',auctionCommentsRouter)


//// test database (Do I need this??)
// const sql = require("./dbconfig/db.config")
// app.use('/test-db', async(req,res)=>{
//     sql.mysqlConnectionDetails.connect((err)=>{
//         if(!err){console.log("Connection successfull"); res.send( "Connection ok" )}
//         else{console.log("Problem with connection" + err); res.send( "Problem with connection" + err)}
//     })
// })


//// start the web server here
const port = process.env.PORT || 4000  // 1024 -> 65535 are good port numbers for dev 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
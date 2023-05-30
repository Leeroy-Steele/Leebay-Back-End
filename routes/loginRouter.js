const express = require('express')
const router = express.Router()

// require controllers here
const loginController = require('../controllers/loginController')

//// user / login routes
router.post('/add-user', async (req,res)=>{

    let user_name = req.body.user_name
    let email = req.body.email
    let user_password = req.body.user_password

    let resp = await loginController.addUser(user_name,email,user_password)
    
    res.json(resp)
    res.status(200)

})

router.delete('/delete-user',(req,res)=>{

    loginController.deleteUser(req,res)

})

router.post('/find-user',(req,res)=>{

    loginController.findUser(req,res)

})

router.post('/check-user-email-and-password',(req,res)=>{

    loginController.findUserAndPassword(req,res)

})

module.exports = router
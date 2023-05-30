let login_dbServices = require('../services/loginDBServices')  // this is causing the problem?

//// users table actions

const addUser = async (user_name,email,user_password)=>{
    //check user name and email are unique
    let allUserData = await login_dbServices.getAllUsers()

    for(let user in allUserData){   

        if(allUserData[user].user_name===user_name){return 'Failed, user name already in use'}
        else if(allUserData[user].email===email){return 'Failed, email already in use'}
    }

    // add user if details are unique
    let resp = login_dbServices.addUser(user_name,email,user_password)
    return await resp

}

const deleteUser = async (req,res)=>{

    let user_id = req.body.user_id

    let resp = login_dbServices.deleteUser(user_id)

    res.json(await resp)
    
}

const findUser = async (req,res)=>{

    let email = req.body.email
    let user_name = req.body.user_name

    let resp = login_dbServices.findUser(email,null,user_name)    // specify either user email / id / user name

    res.json(await resp)
    
}

// change route to check user password? 
const findUserAndPassword = async (req,res)=>{

    let email = req.body.email
    let user_password = req.body.user_password

    let resp = login_dbServices.findUserAndPassword(email,user_password)

    res.json(await resp)
    
}

module.exports = {
    addUser,
    deleteUser,
    findUser,
    findUserAndPassword
}
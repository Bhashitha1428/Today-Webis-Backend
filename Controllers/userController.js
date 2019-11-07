const bcrypt=require('bcryptjs');
const config = require('../config/database');
const User=require('../models/user');

const crypto = require('crypto');


function getUserById (id, callback){
    User.findById(id, callback);
}

 function getUserByEmail (email, role,callback){
    const query2={ $and: [ { email: email },{role:role } ]}
   // const query = {email: email}
    User.findOne(query2, callback);
}


// function getAdminUserByEmail (email, callback){
//     const query={ $and: [ { email: email },{role:"Admin" } ]}
   
//     User.findOne(query, callback);
// }






// function getUserByEmail (email){
//     console.log("zjhczdkh");
//     const query = {email:email}
//     User
//     .findOne(query)
//     .then(user=>{
//         console.log(user);
//         return user;
        
//     })
//     .catch(err=>{
//         console.log("Error"+err);
//     })
// }


// module.exports.addUser = function(newUser, callback){
    
   
//     // bcrypt.genSalt(10, (err, salt) => {
//         bcrypt.hash(newUser.password, 10, (err, hash) => {
            
//            if(err) throw err;
//             newUser.password = hash;
//             newUser.save(callback);
//         });
//     // });
// }

 function comparePassword(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
        }
    )}



    /* user register*/
    function registerUser(req, res,next){
        console.log("AAAAAAAAAA")
    User
    .find({ email: req.body.email })
    .exec()
    .then(user => {
        
        if(user.length >= 1){
            console.log('user exist');
            return res.status(409).json({
                state: false,
                exist: true,
                Message:"use exist"
            });
        
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err){
                    return res.status(500).json({     
                    });
                }else {
                    let newUser = new User({
                        fname: req.body.fname,
                        lname:req.body.lname,
                        email: req.body.email,
                        role: req.body.role,
                        password: hash,
                    })
                     newUser.save()
                        .then(result => {
                            console.log("User signed up"); 
                                res.status(201).json({
                                state: true,
                                exist: false,
                                Message:"User Register Sucessful",
                            
                            });
                           
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err,
                                state: false,
                                Message: "Some Validation Errors"
                            });
                        });
                }
            });
        }
    })
    .catch(err=>{
       res.status(500).json({
           state:false,
           error:err
       })


    })

    }

////
 /* Admin register*/
 function registerAdminUser(req, res,next){
    console.log("Register admin user")
User
.find({ email: req.body.email })
.exec()
.then(user => {
    
    if(user.length >= 1){
        console.log('user exist');
        return res.status(409).json({
            state: false,
            exist: true,
            Message:"use exist"
        });
    
    } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
            if(err){
                return res.status(500).json({     
                });
            }else {
                let newUser = new User({
                    fname: req.body.fname,
                    lname:req.body.lname,
                    email: req.body.email,
                    role: req.body.role,
                    contact:req.body.contact,
                    password: hash,
                })
                 newUser.save()
                    .then(result => {
                        console.log("User signed up"); 
                            res.status(201).json({
                            state: true,
                            exist: false,
                            Message:"User Register Sucessful",
                        
                        });
                       
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err,
                            state: false,
                            Message: "Some Validation Errors"
                        });
                    });
            }
        });
    }
})
.catch(err=>{
   res.status(500).json({
       state:false,
       error:err
   })


})

}







    //check if user is exist
function checkUserIfExist(req, res, next){
    const userId = req.params.userId;
    User
        .find({ _id: userId })
        .exec()
        .then(user => {
            if(!user){
                res.status(500).json({
                    state: false
                })
            } else{
                next()
            }
        })
        .catch(err => {
            res.status(500).json({
                state: false,
                Message: "User Not Exist"
            })
        })
}





//generate random hexadecimal number for verifications
function generateRandomNumber(req, res, next) {
    const len = 7;
    return crypto
      .randomBytes(Math.ceil(len / 2))
      .toString('hex')
      .slice(0, len) 
}  

function generateRandomPassword(req, res, next) {
    const len = 10;
    return crypto
        .randomBytes(Math.ceil(len / 2))
        .toString('hex')
        .slice(0, len)
}

//change password
function resetPassword(userId, newPassword){
    bcrypt.hash(newPassword, 10, (err, hash) => {
        if(err){
            console.log(err)
            return err;
        }else {
            console.log(hash)
            User
                .update({ _id: userId },{$set: { password: hash }})
                .then(result => {
                    console.log(result)
                })

        }
    });
}




    module.exports={
        registerUser:registerUser,
        registerAdminUser:registerAdminUser,

        getUserByEmail:getUserByEmail,
      //  getAdminUserByEmail:getAdminUserByEmail,
        comparePassword:comparePassword,
        getUserById:getUserById,
        checkUserIfExist:checkUserIfExist,

        generateRandomNumber: generateRandomNumber,
        generateRandomPassword: generateRandomPassword,
        resetPassword: resetPassword,
        
    }
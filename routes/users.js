const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const config = require('../config/database');
const User = require('../models/user');
const userController=require('../Controllers/userController');
const checkAuth=require('../middlewares/check-auth');
const bcrypt=require('bcryptjs');


const uploadController=require('../Controllers/uploadController');
const emailController = require('../controllers/emailController');



//Register User 
router.post('/register', userController.registerUser);

//Register Admin
router.post('/registerAdmin',checkAuth.checkIfSuperAdmin, userController.registerAdminUser);




//upload user image for profile
router.post('/uploadUserImage/:userId', uploadController.userImageUpload.single('image'), (req, res, next) => {
    console.log("uploadUserImage")
    const userId = req.params.userId;
    User
        .find({ _id: userId })
        .exec()
        .then(user => {
            console.log("user found")
            cloudinary.uploader.upload(req.file.path, function(result) {
                imageSecureURL = result.secure_url;
                console.log(imageSecureURL)
                //console.log(result)
                user[0].imageURL = imageSecureURL;
                user[0]
                    .save()
                    .then(result => {
                        res.status(200).json({
                            state: true
                        }) 
                    })
            });
        })
        .catch(err => {
            res.status(401).json({
                state: false,
                message:"Errror"
            })
        })
})

//Authenticate(Login)
router.post('/authenticate', (req, res, next)=> {
    console.log("User Authenticate/Login route");
    const email= req.body.email;
    const password = req.body.password;
    const role=req.body.role;
    console.log(email);
    console.log(password);

    userController.getUserByEmail(email,role, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        userController.comparePassword(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch){
              const token = jwt.sign({user: user},config.secret, {
                  expiresIn: 604800 // 1 week 
                
              }
              );
              console.log(token);
              
              res.header('x-auth-token',token);
              res.json({
                  success: true,
                  //token: 'JWT '+token,
                  token: token,
                  user: {
                      id: user._id,
                      name: user.fname,
                      role: user.role,
                      email: user.email,
                      
                  }
              });
          }else{
              return res.json({success: false, msg: 'worng password'})
          }
        });
    });
});


// Admin user Authentication(login)

router.post('/adminUserAuthenticate', (req, res, next)=> {
    console.log("Admin Authenticate/Login route");
    const email= req.body.email;
    const password = req.body.password;
    const role=req.body.role;
    console.log(email);
    console.log(password);

    userController.getUserByEmail(email,role, (err, user) => {
        if(err) throw err;
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }

        userController.comparePassword(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch){
              const token = jwt.sign({user: user},config.secret, {
                  expiresIn: 604800 // 1 week 
                
              }
              );
              console.log(token);
              
              res.header('x-auth-token',token);
              res.json({
                  success: true,
                  //token: 'JWT '+token,
                  token: token,
                  user: {
                      id: user._id,
                      name: user.fname,
                      role: user.role,
                      email: user.email,
                      
                  }
              });
          }else{
              return res.json({success: false, msg: 'worng password'})
          }
        });
    });
});











//profile
router.get('/profile',passport.authenticate('jwt',{session:false}), (req, res, next)=> {
  
    res.json({user:req.user});
});





//Authenticate
// router.post('/authenticate', (req, res, next)=> {
//     console.log("ooooo");
//     const email= req.body.email;
//     const password = req.body.password;

//    const user= userController.getUserByEmail(email)
//         //if(err) throw err;
//         //console.log(user);
//         if(!user){
//             return res.json({success: false, msg: 'User not found'});
//         }

//         userController.comparePassword(password, user.password, (err, isMatch) => {
//           if(err) throw err;
//           if(isMatch){
//               const token = jwt.sign({user: user},config.secret, {
//                   expiresIn: 604800 // 1 week 
                
//               }
//               );
//               console.log(token);
              
//               //res.header('x-auth-token',token);
//               res.json({
//                   success: true,
//                   //token: 'JWT '+token,
//                   token: token,
//                   user: {
//                       id: user._id,
//                       name: user.fname,
//                       role: user.role,
//                       email: user.email,
                      
//                   }
//               });
//           }else{
//               return res.json({success: false, msg: 'worng password'})
//           }
//         });
   
// });


//get all users details
router.get('/allUserDetails',(req,res)=>{
    User
      .find()
      .then(users=>{
          res.status(200).json(users);
      })
      .catch(err=>{
       res.status(500).json({
           error:err,
           mesg:"Users data taking error"
       })

      })


})




 
//get particular user by Id
router.get('/particularUser/:id',(req,res)=>{
      User
         .findById(req.params.id)
         .then(user=>{
           res.json(user);

         })
         .catch(err=>{
          res.json({
            error:err,
          })


         })
  

})
//get users by role
router.get('/findByRole/:role', (req, res, next) => {
    const role = req.params.role;
    User
        .find({ role: role })
        .exec() 
        .then(result => { 
          //  console.log(result);
                res.status(200).json({
                    User: result
            })
        })
        .catch(err => { 
            console.log(err);
            res.status(500).json({  
                error: err
            });
        });
})
////get all content providers
router.get('/contentProviders', (req, res, next) => {
    console.log("get All contentProvider user route") ;
    User
       .find({role:"contentProvider"})
       .exec()
       .then(contentProviders=>{
         
           res.status(200).json(contentProviders);
       })
       .catch(err=>{
           res.status(500).json({
               error:err,
               state:false
           })
       })
   
})

////get all Admin users
router.get('/admins', (req, res, next) => {
  console.log("get All admin user route") ;
    User
       .find({role:"admin"})
       .exec()
       .then(admins=>{
         
           res.status(200).json(admins)
       })
       .catch(err=>{
           res.status(500).json({
               error:err,
               state:false
           })
       })
   
})

////get all student users
router.get('/student', (req, res, next) => {
    console.log("get All admin user route") ;
      User
         .find({role:"student"})
         .exec()
         .then(students=>{
           
             res.status(200).json(students)
         })
         .catch(err=>{
             res.status(500).json({
                 error:err,
                 state:false
             })
         })
     
  })

  ////get all Super Admin users
router.get('/superAdmins', (req, res, next) => {
    console.log("get All admin user route") ;
      User
         .find({role:"superAdmin"})
         .exec()
         .then(superAdmin=>{
           
             res.status(200).json(superAdmin)
         })
         .catch(err=>{
             res.status(500).json({
                 error:err,
                 state:false
             })
         })
     
  })




//get prticular user registered course details by Id
router.get('/:userId', userController.checkUserIfExist, (req, res, next) => {
    console.log("get prticular user registered course details route");
    const Id = req.params.userId;
    User
        .findById(Id)
        .populate('registerCourse')
        .select('registerCourse')
      
        .exec()
        .then(result => {
            res.status(200).json({
                User: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                state: false
            });
        });
});


//edit user account details with password***
//check password of a loged user before edit his profile and Edit user profile
router.put('/editUserProfile/:userId', (req, res, next) => {
    console.log("User profile edit route");
    const userId = req.params.userId;
    const currentPassword = req.body.password;
    console.log(currentPassword);
    // const thispassword;
    User
        .findById(userId)
        .exec()
        .then(user => {
            console.log(user);
            savedPassword = user.password;
            console.log(savedPassword);
            bcrypt.compare(currentPassword,savedPassword, (err, result) => {
                if(result){
                        // console.log("LLLLLLLL")
                    bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
                        if(err){
                            return res.status(500).json({     
                            });
                        }else {
                            
                          //  console.log("KKKKKKKKK");
                            User.update({_id:userId},{
                                $set:{
                                //    fname: req.body.fname ,
                                //    lname:req.body.lname , 
                                   password:hash 
                                }
                            })
                            .then(result=>{
                                res.status(200).json({
                                    state:true,
                                    user:result
                                })

                            })
                            .catch(err=>{
                                res.json(err);
                            })
                               
                               
                        }


                    })
  }


                   
                 else {
                   // console.log("PPPPPPPPP");
                    res.status(500).json({
                        state: false,
                        msg:"incorrect password"

                       
                    })
                }
            })
        })
           .catch(err=>{
                 res.status(500).json({
                    error:err,
                    msg:"User not exit"
                })
          })
})

 
// edit(update) user Profile without password
router.put('/update/:id', (req, res) => {
    const userId=req.params.id;
    console.log("In userDetails update route");
     User
         //.find({_id:userId})
         .update({_id:userId},{
            $set:{
                fname:req.body.fname,
                lname:req.body.lname
            }
            
         },{new:true})
        
         .then(result=>{
             if(result){
                 res.json({
                  result:result,
                  state:true   
                });
             }
         })
         .catch(err=>{
             res.status(500).json({
                 err:err,
                 msg:"user not exit or other error"
             });
         })



    // const c= await User.findOneAndUpdate({_id:req.params.id}, {
    //      fname: req.body.fname ,
    //      lname:req.body.lname ,
    //     // email:req.body.email,
         
    // },{
    //   new:true //return course with updated values
    // })
    // .exec()
    // .then(user=>{
    //   res.status(200).json({
    //      user:user,
    //      state:true 
    //   })
     
   
    // })
    // .catch(err=>{
    //   res.status(500).json({
    //     state:false,
    //     error:err
    // })
    // })
    
});


//delete user by Id and by **** admin or superAdmin
//,userController.checkUserIfExist
router.delete('/delete/:id',checkAuth.checkIfAdminOrSuperAdmin,(req,res)=>{
    console.log(" In user delete Route");
  const userId=req.params.id;
  
        User
              .findById(userId)
              .then(user=>{
                console.log(user)
              
                   if(!user){
                    res.status(500).json({
                       Message:"User is not found" ,
                       state:false
                      
                     })
                     }
                      else{
                      
                              User
                                   .deleteOne({_id:userId})
                                   .then(du=>{
                                    res.status(200).json({
                                      user:user,
                                      state:true,
                                      Message:"User was deleted"
                
                                 })
                                     }) 
                     }
                 })
                 .catch(err=>{
                   res.status(500).json({
                        state:false,
                        Message:err
  
                   })
                 })
  
  
  
  })

  


  //delete(remove) user account by himself

  router.delete('/remove/:id/:pass',(req,res)=>{
      console.log("User account remove route");
    const userId=req.params.id;
    const currentPassword=req.params.pass;
    console.log(currentPassword);
  
    User
          .findById(userId)
          .then(user=>{
            console.log(user.password)
          
               if(!user){
                res.status(500).json({
                   Message:"User is not found" ,
                   state:false
                  
                 })
                 }
                  else{

   
                    bcrypt.compare(currentPassword,user.password, (err, result) => {
                        console.log(result)
                        if(result){
                           // console.log("AAAAAAAAAA")
                            console.log(result)
                              User
                               .deleteOne({_id:userId})
                               .then(du=>{
                                 //  console.log("AAAAAAAAAAmmmm")
                                res.status(200).json({
                                  user:user,
                                  state:true,
                                  Message:"User was deleted"
            
                             })
                                 }) 

                                }     
                                
                                else{
                                    console.log("SSSSSSSS")
                                    res.json({
                                        state:false,
                                        msg:"Incorreect user password"
                                    })
                                }
                    })

                       
                 }
             })
             .catch(err=>{
               res.status(500).json({
                    state:false,
                    Message:err

               })
             })
  })




//send reset password email to user
router.get('/forgotPassword/:email', (req, res, next) => {
    if(!req.params.email){
        res.status(401).json({
            state: false
        })
    } else {  
        const userEmail = req.params.email;
        console.log(userEmail);
        User 
            //.find({ email: userEmail })
            .findOne({ email: userEmail })
            .exec()
            .then(user => {
                if(user){
                   // console.log(user[0]._id);
                   console.log(user);
                    const verificationCode = userController.generateRandomNumber()
                    console.log(verificationCode);
                    emailController.sendVerificationCode(userEmail, verificationCode);
               
                    res.status(200).json({
                        state: true, 
                        //userId: user[0]._id,
                        userId: user._id,
                        code: verificationCode
                    })
                } else {  
                    res.status(500).json({ 
                        state: false,
                        Message: "Not Registered User"
                    })
                }
            }) 
            .catch(err => {
                console.log(err);    
                res.status(500).json({
                    state: false
                })
            })
    }
});




//After verify the email this can save new password for password forgoten person
router.get('/newPassword/:email', (req, res, next) => {
    userEmail = req.params.email;
    console.log(userEmail)
    User
        .find({ email: userEmail })
        .exec()
        .then(user => {  
            
            if(user){
               // console.log(user);
                console.log(user[0]._id)
                const newPassword = userController.generateRandomPassword()
                console.log(newPassword);
                userController.resetPassword(user[0]._id, newPassword)
                emailController.sendNewPassword(userEmail, newPassword);
                    res.status(200).json({
                        state: true,
                        password: newPassword,
                        msg:"Check your emails"
                    })
            }
        })
        .catch(err => {
            console.log("AAAAAAAAAAA")
            res.json({
               // error: err,
                state: false,
                msg:"Not a valid email"
            })
        })
})


 

module.exports = router;
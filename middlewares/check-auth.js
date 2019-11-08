const jwt = require('jsonwebtoken');
const config = require('../config/database');

function decode(req, res, next){
    //const token = req.headers.authorization.split(" ")[1];
   
    const token=req.header('Authorization');
   // console.log(token)
    const decodeJWT = jwt.verify(token,config.secret);

    console.log(decodeJWT.user.role);
  
    
    return decodeJWT;


    
  
}


//check user is Content Provider
function checkIfContentProvider(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next);
     
      //  req.userData = decodeJWT;
        if (decodeJWT.user.role === 'contentProvider'){
            //console.log("contentProvider");
            next()
        } else{
            return res.status(200).json({
                Message: ' Not Permissions'
            });
        }
    } catch (error) {
        
        res.status(401).json({
           
            state: false
        })
    }
}

////check user is Admin
function checkIfAdmin(req, res, next) {
    console.log("AAAAAAAA")
    try {
        const decodeJWT = decode(req, res, next);
     
        //req.userData = decodeJWT;
        if (decodeJWT.user.role === 'admin'){
          
            next()
        } else{
            return res.status(200).json({
                Message: ' Not Permissions, You are not admin user '
            });
        }
    } catch (error) {
        //console.log("PPPPPPPPPPP")
        res.status(401).json({
           
            state: false
        })
    }
}
////check user is Super Admin
function checkIfSuperAdmin(req, res, next) {
    try {
        const decodeJWT = decode(req, res, next);
     
        //req.userData = decodeJWT;
        if (decodeJWT.user.role === 'superAdmin'){
          
            next()
        } else{
            return res.status(200).json({
                Message: ' Not Permissions, You are not super admin user '
            });
        }
    } catch (error) {
       // console.log("PPPPPPPPPPP")
        res.status(401).json({
           
            state: false
        })
    }
}




////check user is Admin or super admin
function checkIfAdminOrSuperAdmin(req, res, next) {
    console.log("AAAAAAAA")
    try {
        const decodeJWT = decode(req, res, next);
     
        //req.userData = decodeJWT;
        if (decodeJWT.user.role === 'admin' || decodeJWT.user.role ==='superAdmin'){
          
            next()
        } else{
            return res.status(200).json({
                Message: ' Not Permissions, You are not admin or super admin user '
            });
        }
    } catch (error) {
        //console.log("PPPPPPPPPPP")
        res.status(401).json({
           
            state: false
        })
    }
}




module.exports = {
    checkIfContentProvider:checkIfContentProvider,
    checkIfAdmin:checkIfAdmin,
    checkIfSuperAdmin:checkIfSuperAdmin,
    checkIfAdminOrSuperAdmin:checkIfAdminOrSuperAdmin
   // decode:decode
   
};
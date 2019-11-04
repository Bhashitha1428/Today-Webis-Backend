
const express = require('express');
const router = express.Router();
const subCatergory=require('../models/subCatergory');

const courseSchema=require('../models/course');
const Course=courseSchema.course;


// add subCatergory
router.post('/addSubCatergory',(req,res,next)=>{
    
    const subCName=req.body.subCatergoryName
    subCatergory
              .findOne({name:subCName})//findone return one object so it check using if block
                                         //if we use find it return array of objects so it can not check whether ia empty using if block
              .then(result=>{
                  if(result){
                      console.log(result.name)
                    res.status(200).json({
                        
                        Message:" That sub Catergory name is already exist"
                    });

                  }
                  else{
                 
                    const newCatergory=new subCatergory({
                    name:subCName,
                    catergoryName:req.body.catergoryName
                })
            newCatergory
                .save()
                .then(result=>{
                  res.status(200).json({
                   subCatergoryName:result.name,
                   state:true,
                   Message:" Added sub Catergory Sucessful"
               });
           })
           .catch(err=>{
             res.status(200).json({
                 state:false,
                 Message:" Added sub Catergory Fail",
                 Error:err,
                 
             });
           })
                  }
              })
        .catch(err=>{
            res.status(200).json({
                state:false,
                 Error:err,
                
            });  
        })




})


//get subCatergory

router.get('/display',(req,res)=>{
  
    subCatergory.find()
    .exec()
    .then(result=>{
       
         console.log(result);
         res.json(result)
     })
     .catch(err=>{
         console.log("Sub Catergories detail retriving error:"+err);
     })
 
   
 
 
 })

 
 //get Course in particular Catergory(not a  SubCatergory)
router.get('/display/:catergory',(req,res)=>{
    
    const cat=req.params.catergory;
    subCatergory.find({catergoryName:cat})
    .exec()
    .then(result=>{
        Course.find({
           // catergory:cat,permission:true
            $and: [ { catergory: cat }, {permission:true } ]
        
        })
        .then(cor=>{
            res.json({
                cor:cor,
                re:result

            });
            
        })
        .catch(err=>{
            res.json(err);
            console.log("Course detail retriving error:"+err);

        })
         //console.log(result);
       // res.json(result)
     })
     .catch(err=>{
         console.log("Sub Catergories detail retriving error:"+err);
     })
     
   
 
 
 })

 //get Course in particular  subCatergory
 router.get('/:subCatergory',(req,res)=>{
    
    console.log("SSSSSSSSS")
    const subCat=req.params.subCatergory;
    Course.find({
      //  subCatergory:subCat
      $and: [ { subCatergory: subCat }, {permission:true } ]
    
    })
    .exec()
    .then(result=>{
        
         //console.log(result);
        res.json(result)
     })
     .catch(err=>{
         console.log("Sub Catergories detail retriving error:"+err);
     })
     
   
 
 
 })

//get subCatergory and courses(belongs to that Catergory) according to particular catergory
 router.get('/display/:catergory/:subCatergory',(req,res)=>{
    
    const cat=req.params.catergory;
    const subCat=req.params.subCatergory;
    Course.find({
       // catergory:cat,subCatergory:subCat

       $and: [ { catergory: cat },{catergory:cat,subCatergory:subCat} ,{permission:true } ]
    
    })
    .exec()
    .then(result=>{
        
         //console.log(result);
        res.json(result)
     })
     .catch(err=>{
         console.log("Sub Catergories detail retriving error:"+err);
     })
     
   
 
 
 })



 //delete sub Catergory

 router.delete('/delete/:subCatergoryName',(req,res)=>{
     
     const subCName=req.params.subCatergoryName
    subCatergory
      .findOne({name:subCName})
      .then(result=>{
          if(result)
          {
              subCatergory
              .deleteMany({name:subCName})
              .then(r=>{
                  res.status(200).json({
                     Message:"Delete sucessfully" ,
                     state:true,
                  })
              })
              .catch(err=>{
                res.status(200).json({
                    Message:"Delete Unsucessfully" ,
                    state:false,
                    error:err,
                 })

              })
          }
          else{
              res.send("That Sub Catergory Not Found")
          }

      })
    

      .catch(err=>{
        res.status(200).json({
            
            error:err,
         })

      }) 
      })


// update subCatergory
router.put('/updateSubCatergory/:id', async (req, res) => {
    console.log("In sub catergory update route")
    const c= await subCatergory.findByIdAndUpdate(req.params.id, {
         name: req.body.subCatergoryName ,
         catergoryName:req.body.catergoryName
         
         
    },{
      new:true //return Catergory with updated values
    })
    .exec()
    .then(subCatergory=>{
      res.status(200).json({
         subCatergory:subCatergory,
         state:true 
      })
     
   
    })
    .catch(err=>{
      res.status(500).json({
        state:false,
        error:err,
       
    })
    })
    
});

 


module.exports=router;
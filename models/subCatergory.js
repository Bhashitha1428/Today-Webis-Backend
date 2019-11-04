
const mongoose=require('mongoose');

// Catergory Schema (This user only to diaplay main catergories into frontEnd)
const subCatergorySchema=mongoose.Schema({
    name:{type:String,required:true},
    catergoryName:{type:String,required:true},
  
  })

  module.exports=mongoose.model('subCatergory',subCatergorySchema);
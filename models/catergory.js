
const mongoose=require('mongoose');

// Catergory Schema (This user only to diaplay main catergories into frontEnd)
const catergorySchema=mongoose.Schema({
    name:{type:String},
  
  })


  module.exports=mongoose.model('catergory',catergorySchema);
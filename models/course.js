const mongoose=require('mongoose');


const courseSchema= mongoose.Schema({
 
  name:{ type:String},
  author:{type:String},
  authorId:{type:String},

  duration:{type:String},//lessmonth,1-3month,3+month
  
  duration2:{type:String},

  description:{type:String},
  //courseImg:{type:String},
  catergory:{type:String},
  subCatergory:{type:String},

  stars:{type:Number},//for count rating
  count:{type:Number},//for count rating
  rate:{type:Number},//(rate=stars/count)

  type:{type:String},// paid course or free course
  skillLevel:{type:String} ,//beginner,intermediate,advanve

  permission:{type:Boolean},
  
   firstVideoId:{type:String},
  /////*********** */
  topics:{type:Array},
  file:{type:Array},
  videoId:{type:Array},

//************* */

// courseImg:{type:String},
 url:{type:String},
  

  registerUser:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
}],
ratedUser:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:'user'
}],


});









module.exports={
  course:mongoose.model('course',courseSchema),

  
}
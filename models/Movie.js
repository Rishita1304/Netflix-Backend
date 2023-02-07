const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
    title:{ type:String, required:true, unique:true },
    desc:{ type:String, required:true },
    img: {type:String},
    imgTitle: {type:String},
    imgSn: {type:String},
    trailer: {type:String},
    video: {type:String},
    year: {type:String},
    limit: {type:Number},
    genre: {type:String},
    isSeries:{type:Boolean, default:false}
},
   { timestamps:true }
   );

   const Movie =mongoose.model('Movie', MovieSchema)
   module.exports = Movie
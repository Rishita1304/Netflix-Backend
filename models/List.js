const mongoose = require('mongoose')

const ListSchema = new mongoose.Schema({
    title:{ type:String },
    type:{ type:String },
    genre: {type:String},
    content:{type:Array}
},
   { timestamps:true }
   );

   const List = mongoose.model('List', ListSchema)
   module.exports = List
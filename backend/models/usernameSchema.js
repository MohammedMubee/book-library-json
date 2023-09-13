const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username:{
    type : String ,
    require : true,
    unique : true

  },
  password:{
    type : String,
    require : true,
    unique : true
  },
  userid:{
    type : Number,
    require : true
  },
  books: {
   type :  [Number],
   default : []
  }
});
const userData = mongoose.model('UserData', userSchema);

module.exports = userData; 

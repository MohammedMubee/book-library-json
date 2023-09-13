const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
  id:{
    type : Number,
    require : true,
    unique : true

  },
  title:{ 
    type : String,
    require : true ,
    unique : true

  },
  author:{
    type : String ,
    require : true ,

  },
  description: {
    type : String,
    require : true ,
  },
  coverImage:{
    type : String,
    require : true ,
  }
});

const Book = mongoose.model('Book', bookSchema);

const book = new Book({
  id : 1001,
  title : "Alice in Wonderland",
  author :  "Lewis Carroll",
  description :  "The life of human",
  coverImage :"https://upload.wikimedia.org/wikipedia/en/3/36/Alice_in_Wonderland_%282010_film%29.png"
})

const book2 = new Book({
  id : 1002,
  title : "David Copperfield",
  author : "Charles Dickens",
  description : "the most important of life",
  coverImage : "https://m.media-amazon.com/images/M/MV5BN2NhMWM0OGMtOWIwMS00OGM1LWJlN2YtMzc4N2UyOTg5MDlkXkEyXkFqcGdeQXVyNjkwMzAwMjQ@._V1_.jpg"
  

})

const book3 = new Book ({
  id : 1003 ,
  title : "The Adventures of Tom Sawyer",
  author : "Mark Twain",
  description : "The powerfull word",
  coverImage :  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVLOlqQGiGOFvL7O6ab557nUC-mE-9SBSKzg&usqp=CAU"
 
})

const book4 = new Book({
  id : 1004 ,
  title : "The power of overthinking",
  author : "Edven",
  description : "The success is most imporatant",
  coverImage : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxilerdm6IoZO3BwuczBI2OLVCJru1cJk2Xg&usqp=CAU"
  
})

const book5 = new Book({
  id : 1005,
  title : "Unbroken",
  author : "mubeen",
  description : "Surrivel",
  coverImage : "https://play-lh.googleusercontent.com/i6vfAxTqqhRKxAC5h7egPx5m2eH_L_VsbK4_Bmc3Wrdr0qf7QLpignD5AojyAEsyxw=s200"
 
})


module.exports = Book; 

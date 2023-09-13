// src/mongoose-config.js

require('dotenv').config(); // Load environment variables from .env

const dbURI = process.env.MONGODB_URI;

// Define Mongoose connection options.
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to the MongoDB database.
mongoose.connect(dbURI, dbOptions);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

module.exports = mongoose;

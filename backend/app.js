const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create an instance of Express
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3000;


const indexRouter = require('./routes/index.router.js');

app.use('/api',indexRouter)

// Configure middleware
app.use(cors());
app.use(bodyParser.json());


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});



// Use your imported routes


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

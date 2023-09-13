const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors())

const jsonFile = 'username.json';
let users = [];

function saveUsers() {
  fs.writeFile(jsonFile, JSON.stringify(users), (err) => {
      if (err) {
          console.error('Error saving users data:', err);
      } else {
          console.log('Users data saved successfully!');
      }
  });
}

function loadUsers() {
  try {
      const data = fs.readFileSync(jsonFile, 'utf8');
      users = JSON.parse(data);
      console.log('Users data loaded successfully!');
  } catch (err) {
      console.error('Error loading users data:', err);
  }
}

loadUsers();

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', username, password);
  console.log('Users:', users); 

  const user = users.find((u) => u.username === username && u.password === password);
  console.log('Found user',user)

  if (user) {
      res.json({ success: true, message: 'Login successful' });
  } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});


app.get('/books/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.userid === userId); 

  if (user) {
    res.json({ success: true, books: user.books });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});






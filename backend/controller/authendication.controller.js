const fs = require('fs');

let users = []
const userData = JSON.parse(fs.readFileSync('username.json', 'utf8'));
const books = JSON.parse(fs.readFileSync('book.json','utf-8'))

exports.loginUser = (req, res) => {
  try {
    console.log('Received login request:', req.body);
    const { username, password } = req.body;

   
    const user = userData.find((u) => u.username === username && u.password === password);

    if (user) {
      res.json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error in loginUser route:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


exports.getUserBooks = (req, res) => {
  const { username } = req.params;
  const user = userData.find((u) => u.username === username);

  if (user) {
    const userBooks = user.books.map((bookId) => {
      const book = books.find((b) => b.id === bookId);
      if (book) {
        return {
          id: book.id,
          title: book.title,
          author: book.author,
          description: book.description,
          coverImage: book.coverImage,
        };
      }
      return null; 
    });

    const validUserBooks = userBooks.filter((book) => book !== null);

    res.json({ success: true, books: validUserBooks });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
};


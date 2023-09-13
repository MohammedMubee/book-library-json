const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require("fs");
const port = 3000;

const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.use(express.json());
const bookFilePath = 'boononodek.json';
const userFilePath = 'username.json';



function getBooksData() {
  const rawData = fs.readFileSync('book.json', 'utf-8'); 
  return JSON.parse(rawData);
}

function saveBooksData(books) {
  fs.writeFileSync('book.json', JSON.stringify(books, null, 2));
}

function getUsersData() {
  const rawData = fs.readFileSync('username.json', 'utf-8'); 
  return JSON.parse(rawData);
}

function saveUsersData(users) {
  fs.writeFileSync('username.json', JSON.stringify(users, null, 2));
}


app.get('/allbooks', (req, res) => {
  const books = getBooksData();
  res.json(books);
});

app.get('/books/id', (req, res) => {
  const books = getBooksData();
  const bookId = parseInt(req.params.id);
  const book = books.find(book => book.id === bookId);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.get('/books/author/:authorname', (req, res) => {
  const books = getBooksData();
  const authorname = req.params.authorname.toLowerCase();
  const author = books.filter(book => book.author.toLowerCase() === authorname);

  if (author.length) {
    res.json(author);
  } else {
    res.status(404).json({ error: 'Author not found' });
  }
});

app.get('/books/search/:bookName', (req, res) => {
  const books = getBooksData();
  const bookName = req.params.bookName.toLowerCase();
  const book = books.find(book => book.name.toLowerCase() === bookName);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
});

app.delete('/books/:name', (req, res) => {
  const books = getBooksData();
  const bookName = req.params.name;
  const filteredBooks = books.filter(book => book.name !== bookName);

  saveBooksData(filteredBooks); 

  res.json({ message: 'Book deleted successfully.' });
});

app.get('/books/add', (req, res) => {
  const books = getBooksData();
  res.json(books);
});

app.post('/books', (req, res) => {
  const { body } = req;
  console.log(body);

  const books = getBooksData();
  books.push(body); 

  saveBooksData(books); 
  res.status(201).json({ message: 'Book added successfully',...body });
});

const booksData = getBooksData(); 

const usersData = getUsersData(); 

app.get('/users/:userid/books', (req, res) => {
  const userId = req.params.userid;
  const user = usersData.find(user => user.userid === userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const userBooks = booksData.filter(book => user.books.includes(book.id));

  res.json(userBooks);
});



app.post('/users/:userid/books', (req, res) => {
  const { userid } = req.params;
  const { bookId } = req.body;

  const user = usersData.find(user => user.userid === userid);

  if (!user) {
    return res.status(404).json({ message: 'Userid not found' });
  }

  const book = booksData.find(book => book.id === bookId);

  if (!book) {
    return res.status(404).json({ message: 'Bookid not found' });
  }

  if (user.books.includes(bookId)) {
    return res.status(400).json({ message: 'Book already exists in the user\'s collection' });
  }

  user.books.push(bookId);
  saveUsersData(usersData); 
  saveBooksData(booksData);

  res.json({ message: 'Book added to user\'s collection successfully' });
});

const users = JSON.parse(fs.readFileSync('username.json', 'utf-8'));
const bookdata = JSON.parse(fs.readFileSync('book.json', 'utf-8'));
app.get('/user/books', (req, res) => {
  try {
    const username = req.query.username;
    const loggedInUser = users.find(u => u.username === username);

    if (!loggedInUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userBookList = loggedInUser.books.map(bookId => {
      const book = booksData.find(book => book.id === bookId);
      if (!book) {
        return null; 
      }
      return {
        id: book.id,
        name: book.name,
        author: book.author,
        description: book.description
      };
    }).filter(book => book !== null);

    res.json(userBookList);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/books/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find((u) => u.userid === userId); 

  if (user) {
    res.json({ success: true, books: user.books });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

app.post('/api/booklist', async (req, res) => {
    const { user, bookId } = req.body;
    console.log('Received request to add book:', user, bookId);

    if (!user || !bookId) {
        return res.status(400).json({ error: 'Both user and bookId are required.' });
    }

    const userIndex = users.findIndex(u => u.username === user);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const parsedBookId = parseInt(bookId);

    if (isNaN(parsedBookId)) {
        return res.status(400).json({ error: 'Invalid bookId format.' });
    }

    const foundUser = users[userIndex];

    if (foundUser.books.includes(parsedBookId)) {
        return res.json({ message: 'Book already exists in the user\'s booklist.' });
    }

    foundUser.books.push(parsedBookId);

    try {
        await saveUsersData(users);
        console.log('Book added to user\'s booklist:', parsedBookId);
        return res.json(foundUser.books);
    } catch (error) {
        console.error('Error saving users data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

    
    








 


  





    
    
    











 


  





    
    
    
    


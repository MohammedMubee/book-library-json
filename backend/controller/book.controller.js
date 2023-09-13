
const fs = require("fs");
const usersData = JSON.parse(fs.readFileSync('username.json', 'utf8'));
const booksData = JSON .parse(fs.readFileSync('book.json','utf-8'))


function getBooksData() {
  try {
    const rawData = fs.readFileSync('book.json', 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error fetching books data:', error);
    return [];
  }
}

function saveBooksData(books) {
  fs.writeFileSync('book.json', JSON.stringify(books, null, 2));
}

exports.getAllBooks = (req, res) => {
  const books = getBooksData();
  res.json(books);
};

exports.getBookById = (req, res) => {
  const books = getBooksData();
  const bookId = parseInt(req.params.id);
  const book = books.find((book) => book.id === bookId);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
};

exports.addBook = (req, res) => {
  const { body } = req;
  console.log(body);

  const books = getBooksData();
  books.push(body);

  saveBooksData(books);
  res.status(201).json({ message: 'Book added successfully', ...body });
};



exports.addnewbook = (req, res) => {
  const { username } = req.params;
  const { bookId } = req.body;

  const user = usersData.find(user => user.username === username);

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
};


exports.bookId = (req, res) => {
  const books = getBooksData();
  const bookId = parseInt(req.params.id);
  const book = books.find(book => book.id === bookId);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: 'Book not found' });
  }
};




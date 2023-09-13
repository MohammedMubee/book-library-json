async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3000/api/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('username', username);
            window.location.href = 'book_store.html'; 
        } else {
            alert('Login failed! Please try again.');
        }
    } else {
        alert('Login failed! Please try again.');
    }
}



document.getElementById("logout-tab").addEventListener("click", function(event) {
    event.preventDefault(); 
    logout(); 
});

function logout() {
    try {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('username');
        window.location.href = 'log.html'; 
    } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred during logout. Please try again later.');
    }
}

async function fetchBooksData() {
    try {
        const response = await fetch('http://localhost:3000/api/book/allbooks'); 
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

async function updateBookList() {
    try {
        const bookListContainer = document.getElementById('all-books');
        const booksData = await fetchBooksData();
        console.log(booksData)
    
        
        const bookCardsHTML = booksData.map(book => `
            <div class="col-md-4 mb-4" id="book-card-${book.id}">
                <div class="card">
                    <img src="${book.coverImage || 'default-book-image.jpg'}" class="card-img-top" alt="${book.name}">
                    <div class="card-body">
                        <h5 class="card-title">${book.name}</h5>
                        <p class="card-text">Author: ${book.author}</p>
                        <button class="addToBookListBtn" data-book-id="${book.id}">Add Book to Booklist</button>  
                    </div>
                </div>
            </div>
        `);

        bookListContainer.innerHTML = bookCardsHTML.join('');
        
        const addToBookListButtons = document.querySelectorAll('.addToBookListBtn');
        addToBookListButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const bookId = button.getAttribute('data-book-id');
                const username = localStorage.getItem('username');
                if (username) {
                    await addToBookList(username, bookId);
                } else {
                    console.error('User not logged in');
                }
            });
        });
    } catch (error) {
        console.error('Error updating book list:', error);
    }
}

$('#books-tab').on('shown.bs.tab', updateBookList);
updateBookList()



document.getElementById('addBookForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newBook = {
        id: formData.get('bookid'),
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description')
    };

    try {
        const response = await fetch('http://localhost:3000/api/book/addBook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            event.target.reset();
            await fetchAndDisplayBooks(); 
        } else {
            console.error('Error adding book:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
});

async function fetchAndDisplayBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/book/allbooks');
        const books = await response.json();

        const bookListContainer = document.getElementById('all-books');
        bookListContainer.innerHTML = ''; 

        books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');

            const cardContent = `
                <div class="card">
                    <img src="${book.coverImage || 'default-book-image.jpg'}" class="card-img-top" alt="${book.name}">
                    <div class="card-body">
                        <h5 class="card-title">${book.name}</h5>
                        <p class="card-text">Author: ${book.author}</p>
                    </div>
                </div>
            `;

            card.innerHTML = cardContent;
            bookListContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching and displaying books:', error);
    }
}




async function fetchAndDisplayUserBooks() {
    console.log('fetchAndDisplayUserBooks function is being executed');
    
    // Check if the user is logged in
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');
  
    if (!loggedIn || !username) {
      console.log('User is not logged in.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/user/login`);
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Error:', data.message);
        return;
      }
  
      const userBooks = data.user.books;
      console.log('User\'s Books:', userBooks);
      // Display the user's books as needed
    } catch (error) {
      console.error('Error:', error);
      // Handle the error scenario
    }
  }
  
  // Call the function to fetch and display user books
  fetchAndDisplayUserBooks();
  

async function updateBookList() {
    try {
        const bookListContainer = document.getElementById('book-list');
        const booksData = await fetchBooksData();
        

        const bookCardsHTML = booksData.map(book => `
        <div class="col-md-4 mb-4" id="book-card-${book.id}">
        <div class="card">
            <img src="${book.coverImage || './img/images.jpg'}" class="card-img-top" alt="${book.name}">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">Author: ${book.author}</p>
                <p class="card-text">Id: ${book.id}</p>
                <p class="card-text">description:${book.description}</p>
            </div>
        </div>
       </div>
   `);

        bookListContainer.innerHTML = bookCardsHTML.join('');
        
       
        const removeFromBookListButtons = document.querySelectorAll('.removeFromBookListBtn');
        removeFromBookListButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const bookId = button.getAttribute('data-book-id');
                console.log('Clicked bookId:', bookId); 

               
                await removeFromBookList(bookId);
                
             
                const cardId = `book-card-${bookId}`;
                const cardToRemove = document.getElementById(cardId);
                if (cardToRemove) {
                    cardToRemove.remove();
                }
            });
        });
    } catch (error) {
        console.error('Error updating book list:', error);
    }
}

updateBookList();

async function fetchAndDisplayBooks() {
    try {
        const response = await fetch('http://localhost:3000/api/book/allbooks');

        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        const books = await response.json();

        const bookListContainer = document.getElementById('all-books'); 
        bookListContainer.innerHTML = ''; 
        console.log(books)
        books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-4');

            card.innerHTML = `
            <div class="card">
            <img src="${book.coverImage || ' ./img/images.jpg'}"class="card-img-top" alt="${book.title}">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">Author: ${book.author}</p>
                <p class="card-text">ID: ${book.id}</p>
                <p class="card-text">description: ${book.description}<p>
                <button class="btn btn-primary add-to-cart-btn" data-book-id="${book.id}">Add to Cart</button>
            </div>
        </div>
       
    `;
            card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
                const bookId = book.id; 
                const username = localStorage.getItem('username');
                if (username) {
                    addToBooklist(bookId); 
                } else {
                    console.error('User not logged in');
                }
            });
            

            bookListContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching and displaying books:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchAndDisplayBooks);



document.getElementById('addBookForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newBook = {
        id: formData.get('bookid'),
        title: formData.get('title'),
        author: formData.get('author'),
        description: formData.get('description')
    };
    div.innerHTML=''

    try {
        const response = await fetch('http://localhost:3000/api/book/addbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newBook)
        });

        if (response.ok) {
            event.target.reset();
            fetchAndDisplayBooks();
            const loggedIn = localStorage.getItem('loggedIn');
            const userId = localStorage.getItem('userId');
            if (loggedIn === 'true' && userId) {
                const userBookList = await getUserBookList(userId);
                displayUserBooks(userBookList);
            }
        } else {
            console.error('Error adding book:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding book:', error);
    }
})

const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    event.preventDefault();

    const bookId = button.getAttribute('data-book-id');
    const username = localStorage.getItem('username');

    if (!username) {
      console.error('Username not found in local storage. Please log in.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/books/:username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user: username,
          bookId: bookId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData.error);
        return;
      }

      const responseData = await response.json();
      console.log('Book added to cart:', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  });
});
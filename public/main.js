document.getElementById('loadBooks').addEventListener('click', () => {
    axios.get('/books')
        .then(response => {
            const books = response.data;
            const booksList = document.getElementById('booksList');
            booksList.innerHTML = ''; // Clear the list

            books.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.classList.add('book');
                bookItem.innerHTML = `
                    <h2>${book.name || book.title}</h2>
                    <p>Author: ${book.author}</p>
                    <p>Year: ${book.year}</p>
                    <button onclick="deleteBook(${book.id})">Delete</button>
                `;
                booksList.appendChild(bookItem);
            });
        })
        .catch(error => {
            console.error('Error fetching the books:', error);
        });
});

function deleteBook(id) {
    axios.delete(`/books/${id}`)
        .then(() => {
            alert('Book deleted successfully');
            document.getElementById('loadBooks').click(); // Refresh the list
        })
        .catch(error => {
            console.error('Error deleting the book:', error);
        });
}

document.getElementById('addBookForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const newBook = {
        name: document.getElementById('addName').value,
        author: document.getElementById('addAuthor').value,
        year: document.getElementById('addYear').value
    };
    
    axios.post('/books', newBook)
        .then(response => {
            alert('Book added successfully');
            document.getElementById('addBookForm').reset();
            document.getElementById('loadBooks').click(); // Refresh the list
        })
        .catch(error => {
            console.error('Error adding the book:', error);
        });
});

document.getElementById('updateBookForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const bookId = document.getElementById('updateId').value;
    const updatedBook = {
        name: document.getElementById('updateName').value,
        author: document.getElementById('updateAuthor').value,
        year: document.getElementById('updateYear').value
    };
    
    axios.put(`/books/${bookId}`, updatedBook)
        .then(response => {
            alert('Book updated successfully');
            document.getElementById('updateBookForm').reset();
            document.getElementById('loadBooks').click(); // Refresh the list
        })
        .catch(error => {
            console.error('Error updating the book:', error);
        });
});

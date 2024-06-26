import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '/swagger'; // Importa las especificaciones de Swagger

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Funciones de lectura y escritura de datos
const readData = () => {
  try {
    const data = fs.readFileSync('./db.json');
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
    return { books: [] }; // Manejo básico de errores, retornando un objeto vacío
  }
};

const writeData = (data) => {
  try {
    fs.writeFileSync('./db.json', JSON.stringify(data));
  } catch (error) {
    console.log(error);
  }
};

// Rutas de la API

// Endpoint para obtener todos los libros
app.get('/books', (req, res) => {
  const data = readData();
  res.json(data.books);
});

// Endpoint para obtener un libro por su ID
app.get('/books/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const book = data.books.find((book) => book.id === id);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Endpoint para crear un nuevo libro
app.post('/books', (req, res) => {
  const data = readData();
  const body = req.body;
  const newBook = {
    id: data.books.length + 1,
    ...body,
  };
  data.books.push(newBook);
  writeData(data);
  res.status(201).json(newBook);
});

// Endpoint para actualizar un libro por su ID
app.put('/books/:id', (req, res) => {
  const data = readData();
  const body = req.body;
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    data.books[bookIndex] = {
      ...data.books[bookIndex],
      ...body,
    };
    writeData(data);
    res.json({ message: 'Book updated successfully' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Endpoint para eliminar un libro por su ID
app.delete('/books/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);
  const bookIndex = data.books.findIndex((book) => book.id === id);
  if (bookIndex !== -1) {
    data.books.splice(bookIndex, 1);
    writeData(data);
    res.json({ message: 'Book deleted successfully' });
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Middleware para servir la documentación de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

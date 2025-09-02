// app.js
const express = require('express');
const db = require('./db');

const app = express();
const PORT = 8000;

app.use(express.json()); // Para parsear JSON en requests

// Obtener todas las películas
app.get('/movies', (req, res) => {
  db.all('SELECT * FROM movies', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Obtener una película por ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM movies WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Película no encontrada' });
    } else {
      res.json(row);
    }
  });
});

// Agregar una nueva película
app.post('/movies', (req, res) => {
  const { title, year, director } = req.body;
  if (!title || !year) {
    return res.status(400).json({ error: 'title y year son obligatorios' });
  }
  db.run(
    'INSERT INTO movies (title, year, director) VALUES (?, ?, ?)',
    [title, year, director || null],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).json({ id: this.lastID, title, year, director });
      }
    }
  );
});

// Actualizar una película
app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title, year, director } = req.body;
  db.run(
    'UPDATE movies SET title = ?, year = ?, director = ? WHERE id = ?',
    [title, year, director, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Película no encontrada' });
      } else {
        res.json({ message: 'Película actualizada correctamente' });
      }
    }
  );
});

// Eliminar una película
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM movies WHERE id = ?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Película no encontrada' });
    } else {
      res.json({ message: 'Película eliminada correctamente' });
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

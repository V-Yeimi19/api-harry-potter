// db.js
const sqlite3 = require('sqlite3').verbose();

// Abrimos la base de datos (archivo hp_movies.db)
const db = new sqlite3.Database('./hp_movies.db', (err) => {
  if (err) {
    console.error('Error abriendo la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    db.run(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER NOT NULL,
        director TEXT
      )
    `);
  }
});

module.exports = db;

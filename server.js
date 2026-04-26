const express = require("express");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");
const dbPath = path.join(dataDir, "artists.db");

fs.mkdirSync(dataDir, { recursive: true });

const db = new sqlite3.Database(dbPath);

/******************** CREACIÓ DE TAULES ********************/

// Creem la taula d'ARTISTES i ens assegurem que hi hagi dades inicials.
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

// Creem la taula d'ALBUMS i ens assegurem que hi hagi dades inicials.
  db.run(`
    CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      artist_id INTEGER,
      FOREIGN KEY (artist_id) REFERENCES artists(id);
    )
  `);

// Creem la taula de CANÇONS i ens assegurem que hi hagi dades inicials.
  db.run(`
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      album_id Integer,
      FOREIGN KEY (album_id) REFERENCES album(id);
    )
  `);

  db.get("SELECT id FROM artists WHERE name = ?", ["Txarango"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Txarango"]);
    }
  });

  db.get("SELECT id FROM artists WHERE name = ?", ["Oques Grasses"], (error, row) => {
    if (error) {
      console.log("Error comprovant dades inicials:", error.message);
      return;
    }

    if (!row) {
      db.run("INSERT INTO artists (name) VALUES (?)", ["Oques Grasses"]);
    }
  });
});

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/********************* CREACIÓ API *********************/

//Afegir Artista
app.post("/api/AddArtist",  (req, res) => {
  const name = req.body.data;
  db.run("INSERT INTO artists (name) VALUES (?)", [name], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Artista desat: ${name}`);
  });
});

//Eliminar Artista
app.delete("/api/DeleteArtist",  (req, res) => {
  const name = req.body.data;
  db.run("DELETE FROM artists WHERE name = ?", [name], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Artista eliminat: ${name}`);
  });
});

app.post("/api/artists",  (req, res) => {
  const table = req.body.data;
  db.all(`SELECT * FROM ${table} ORDER BY id DESC`, (err, rows) => {
    if (err){
      return res.status(500).json({ error: err.message });
    }
    console.log(rows);
    res.json({ result: rows });
  });
});

// Afegir Album
app.post("/api/AddAlbum",  (req, res) => {
  const { name, artist_id } = req.body.data;
  db.run("INSERT INTO albums (name, artist_id) VALUES (?, ?)", [name, artist_id], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Album desat: ${name}`);
  });
});

// Afegir Cançó
app.post("/api/AddSongs",  (req, res) => {
  const { name, album_id } = req.body.data;
  db.run("INSERT INTO songs (name, album_id) VALUES (?, ?)", [name, album_id], (error) => {
    if (error) {
      res.status(500).type("text").send(`Error: ${error.message}`);
      return;
    }
    res.status(201).type("text").send(`Canço desada: ${name}`);
  });
});


app.listen(PORT, () => {
  console.log(`Servidor a http://localhost:${PORT}`);
  console.log(`Base de dades SQLite: ${dbPath}`);
});

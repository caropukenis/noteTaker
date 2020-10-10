const express = require("express");
const fs = require("fs");
const util = require("util");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  readFile("./db/db.json", "utf8")
    .then((data) => {
      const notes = JSON.parse(data);
      res.json(notes);
    })
    .catch((err) => console.log(err));
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;

  let notes = await readFile("./db/db.json", utf8);
  notes = JSON.parse(notes);

  notes = notes.filter((note) => note.id !== id);

  await writeFile("./db/db.json", JSON.stringify(notes));
  res.json(notes);
});

app.listen(PORT, () => {
  console.log(`Server listening at PORT: ${PORT}`);
});

const express = require("express");
const app = express();
const path = require("path");
var port = process.env.PORT || 8080;
var fs = require("fs");
app.use(express.static("public"));

app.use(express.json());
let messages = [];
fs.readFile("db/db.json", "utf8", function readFileCallback(err, data) {
  if (err) {
    console.log(err);
  } else {
    messages = JSON.parse(data);
  }
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.json(messages);
});

app.post("/api/notes", (req, res) => {
  console.log(req.body);
  if (!req.body.title) {
    res.status(400).json({
      error: "Missing title, JSON must have title property",
    });
  } else if (typeof req.body.text !== "string") {
    res.status(400).json({
      error: "Note must be a string in the text field",
    });
  } else {
    const ids = messages.map((m) => m.id);
    const uniqueId = messages.length > 0 ? Math.max(...ids) + 1 : 1;
    messages.push({
      title: req.body.title,
      text: req.body.text,
      id: uniqueId,
    });
    fs.writeFile("db/db.json", JSON.stringify(messages), function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.json({
      message: "Note added",
    });
  }
});

app.delete("/api/notes/:id", (req, res) => {
  messages = messages.filter((note) => note.id !== Number(req.params.id));
  fs.writeFile("db/db.json", JSON.stringify(messages), function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.json({
    message: "Note deleted",
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const express = require("express");
const app = express();
var port = process.env.PORT || 8080;
var fs = require("fs");

app.use(express.json());
let messages = [];
fs.readFile("notes.json", "utf8", function readFileCallback(err, data) {
  if (err) {
    console.log(err);
  } else {
    messages = JSON.parse(data);
  }
});

app.get("/notes", (req, res) => {
  res.json({
    messages,
  });
});
app.post("/notes", (req, res) => {
  console.log(req.body);
  if (!req.body.note) {
    res.status(400).json({
      error: "Missing note, JSON must have note property",
    });
  } else if (typeof req.body.note !== "string") {
    res.status(400).json({
      error: "Note must be a string",
    });
  } else {
    messages.push(req.body.note);
    fs.writeFile("notes.json", JSON.stringify(messages), function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.json({
      message: "Note added",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

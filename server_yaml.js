const express = require("express");
const fs = require("fs");
const cors = require("cors"); 
const app = express();
const port = 3002;

const dbFile = "./db.yml";

app.use(cors()); 

app.get("/", (req, res) => {
  try {
    const fileContents = fs.readFileSync(dbFile, "utf8");
    res.type("text/yaml");
    res.send(fileContents);
  } catch (err) {
    console.error("Error reading db.yml:", err);
    res.status(500).send("Error reading db.yml");
  }
});

// get
app.get("/json", (req, res) => {
  try {
    const yaml = require("js-yaml");
    const fileContents = fs.readFileSync(dbFile, "utf8");
    const data = yaml.load(fileContents);
    res.json(data);
  } catch (err) {
    res.status(500).send("Error converting YAML to JSON");
  }
});

//  server
app.listen(port, () => {
  console.log(`This is running at http://localhost:${port}`);
});

const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 3000;
const dbFile = "./db.json";

app.use(cors());
app.use(express.json());


function readDB() {
  return JSON.parse(fs.readFileSync(dbFile, "utf8"));
}
function writeDB(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  const db = readDB();
  res.json(db);
});


app.get("/borrows", (req, res) => {
  const db = readDB();
  res.json(db); 
});

app.get("/borrows/:id", (req, res) => {
  const db = readDB();
  const borrow = db.find(b => b.borrow_transactionid === req.params.id);
  if (!borrow) return res.status(404).json({ error: "Borrow not found" });
  res.json(borrow);
});

app.post("/borrows", (req, res) => {
  const db = readDB();
  db.push(req.body);
  writeDB(db);
  res.status(201).json(req.body);
});

app.put("/borrows/:id", (req, res) => {
  const db = readDB();
  const index = db.findIndex(b => b.borrow_transactionid === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Borrow not found" });
  db[index] = req.body;
  writeDB(db);
  res.json(req.body);
});

app.delete("/borrows/:id", (req, res) => {
  const db = readDB();
  const index = db.findIndex(b => b.borrow_transactionid === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Borrow not found" });
  db.splice(index, 1);
  writeDB(db);
  res.sendStatus(204);
});

app.put("/student", (req, res) => {
  const db = readDB();
  db.forEach(b => {
    b.Student = req.body;
  });
  writeDB(db);
  res.json(req.body);
});

app.patch("/student/fines", (req, res) => {
  const db = readDB();
  db.forEach(b => {
    if (req.body.borrow_fines !== undefined) b.Student.borrow_fines = req.body.borrow_fines;
    if (req.body.borrow_status !== undefined) b.Student.borrow_status = req.body.borrow_status;
  });
  writeDB(db);
  res.json({ message: "Fines/status updated", borrows: db });
});


app.listen(port, () => {
  console.log(`This is running athttp://localhost:${port}`);
});

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 3001;

const salt = bcrypt.genSaltSync(10);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "1001",
  database: "accredian",
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, salt);
  db.query(
    "INSERT INTO user (username, email, password) VALUES (?,?,?)",
    [username, email, hashedPassword],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
    }
  );
  return res.json({ message: "Data received successfully" });
});

app.post("/login", (req, res) => {
  const { userId, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, salt);
  db.query(
    "SELECT * FROM user WHERE (username=? OR username=?) AND password=?",
    [userId, userId, passwordHash],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        res.send(result);
      } else {
        res.send({ message: "Wrong username/password combination" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Running server on ", PORT);
});

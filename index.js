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
      res.send(result);
    }
  );
});

app.post("/login", (req, res) => {
  const { userId, password } = req.body;

  db.query(
    "SELECT * FROM user WHERE username=? OR email=?",
    [userId, userId],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        const storedHashedPassword = result[0].password;
        if (bcrypt.compareSync(password, storedHashedPassword)) {
          res.send(result);
        } else {
          res.send({ message: "Wrong username/password combination" });
        }
      } else {
        res.send({ message: "User not found" });
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Running server on ", PORT);
});

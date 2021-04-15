const express = require("express");

const app = express();
const port = 5500;

const password = "abdur1234";
const name = "manSalon";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);

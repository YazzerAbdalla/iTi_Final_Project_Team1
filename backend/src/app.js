const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect(
    "mongodb+srv://iti_db_project:itX836IrVSSfOzR1@cluster0.swbigys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB connected successfuy!");
  });

app.get("/", (req, res) => {
  res.json({ message: "Hi demo" });
});

app.listen(3001, () => {
  console.log("Server working successfully on port 3001");
});

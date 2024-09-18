const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hi demo" });
});

app.listen(3001, () => {
  console.log("Server working successfully on port 3001");
});

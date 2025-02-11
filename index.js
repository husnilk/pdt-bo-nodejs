const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const router = require("./routes");

const PORT = 3000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

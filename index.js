require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const apiRouter = require("./controllers");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/api", apiRouter);

if (!process.env.DETA_RUNTIME) {
  app.listen(process.env.PORT, () =>
    console.log(`Listening on http://localhost:${process.env.PORT}`)
  );
}

module.exports = app;

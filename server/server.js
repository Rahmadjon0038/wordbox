const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// ------------- Auth router -----------
const authRouter = require("./router/authRouter");
app.use("/api/auth", authRouter);

// ------------- Lessons router -----------
const lessonsRouter = require("./router/lessonRoutes");
app.use("/api/lessons", lessonsRouter);

// ------------- Lessonga sozlar qoshish router -----------
const wordRouter = require("./router/wordRoutes");
app.use("/api/words", wordRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ msg: "Word-box Backendga hush kelibsiz hush kelinsiz" });
});

app.listen(process.env.PORT, () => {
  console.log(`server ${process.env.PORT} - porda da ishga tushdi`);
});

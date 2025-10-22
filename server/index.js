const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose  = require("mongoose");
const app = express();
const port = 8000;

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.log("Error connecting to MongoDB:", err);
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/clubs', require('./routes/clubRoute'));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

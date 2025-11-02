const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const mongoose  = require("mongoose");

const cookieParser = require("cookie-parser");

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

//middleware
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/clubs', require('./routes/clubRoute'));
app.use('/api/events', require('./routes/eventRoute'));
app.use("/api/notifications", require("./routes/notificationRoutes"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

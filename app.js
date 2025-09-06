const express = require("express");
const authRouter = require("./routes/authRoutes");
const logger = require("./utils/logger");
const cookieParser = require("cookie-parser");
const errorRoute = require("./utils/errorRoute");
const noteRouter = require("./routes/noteRoutes");

const app = express();

// middleware to parse cookies
app.use(cookieParser());

// middleware to parse JSON request bodies
app.use(express.json());

// middleware to log requests
app.use(logger);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notes", noteRouter);

// middleware to handle 404 errors
app.use(errorRoute);

module.exports = app;
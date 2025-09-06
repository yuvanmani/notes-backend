const express = require("express");
const { newNote, viewAllNote, updateNote, deleteNote, viewNoteById } = require("../controllers/noteController");
const isAuthenticated = require("../middlewares/auth");

const noteRouter = express.Router();

// protected routes
noteRouter.post("/new", isAuthenticated, newNote);
noteRouter.get("/view", isAuthenticated, viewAllNote);
noteRouter.get("/view/:id", isAuthenticated, viewNoteById);
noteRouter.put("/update/:id", isAuthenticated, updateNote);
noteRouter.delete("/delete/:id", isAuthenticated, deleteNote);

module.exports = noteRouter;
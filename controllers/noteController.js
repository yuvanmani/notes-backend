const Note = require("../models/note");

const noteController = {
    newNote: async (req, res) => {
        try {
            // get the userId from the request
            const userId = req.userId;

            // get the content from the request body
            const { content } = req.body;

            // validate input
            if (!userId || !content) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // create new note
            const newNote = new Note({
                userId, content
            })

            // save note to the database
            await newNote.save();

            // send response to the user
            return res.status(201).json({ message: "Note created successfully" });
        }
        catch (error) {
            return res.status(500).json({ message: "Note creation failed" });
        }
    },
    viewAllNote: async (req, res) => {
        try {
            // get userId from request
            const userId = req.userId;

            // get all notes details from database
            const notes = await Note.find({ userId }).select("-__v -createdAt -updatedAt");

            // send response to the user
            return res.status(200).json(notes);
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to retrieve notes" });
        }
    },
    viewNoteById: async (req, res) => {
        try {
            // get note Id from params
            const { id } = req.params;

            // get note from database
            const note = await Note.findById(id).select("-__v -createdAt -updatedAt -userId");

            if (!note) {
                return res.status(404).json({ message: "Note not found" });
            }

            // send response to the user
            return res.status(200).json(note);
        }
        catch (error) {
            return res.status(500).json({ message: "Failed to retrieve note" });
        }
    },
    updateNote: async (req, res) => {
        try {
            // get note Id from params
            const { id } = req.params;

            // get the update details from request body
            const { content } = req.body;

            // update the details
            const note = await Note.findByIdAndUpdate(id, { content }, { new: true }).select("-__v -createdAt -updatedAt");

            if (!note) {
                return res.status(404).json({ message: "Note not found" });
            }

            // send the updated note in response
            return res.status(200).json({ message: "Note updated successfully" });
        }
        catch (error) {
            return res.status(500).json({ message: "Update note failed" });
        }
    },
    deleteNote: async (req, res) => {
        try {
            // get note Id from params
            const { id } = req.params;

            // find note by id
            const note = await Note.findById(id);

            if (!note) {
                return res.status(404).json({ message: "Note not found" });
            }

            // delete the note by Id
            await Note.findByIdAndDelete(id);

            // send response to the user
            return res.status(200).json({ message: "Note has been deleted" });

        }
        catch (error) {
            return res.status(500).json({ message: "Delete note failed" });
        }
    }
}

module.exports = noteController;
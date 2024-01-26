const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const pool = require("./db");
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());

// functions 

// create a note
app.post('/notes', async (req, res) => {
    try {
        const {note_content} = req.body;
        var current_date = new Date();
        console.log(current_date);
        const newNote = await pool.query(
            "INSERT INTO notes (note_content, date_created) VALUES($1, $2) RETURNING *", 
            [note_content, current_date]
        );

        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);    
    }
});

// get all notes
app.get('/notes', async(req, res) => {
    try {
        const allNotes = await pool.query("SELECT * FROM notes ORDER BY notes_id ASC");
        res.json(allNotes.rows)
    } catch (err) {
        console.error(err.message);
    }
})

// get a note
app.get('/notes/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const note = await pool.query(
            "SELECT * FROM notes WHERE notes_id = $1", [id]);
        res.json(note.rows);
    } catch (err) {
        console.error(err.message);
    }
})

// update a note
app.put("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { note_content } = req.body;
        const updateNote = await pool.query("UPDATE notes SET note_content = $1 WHERE notes_id = $2", 
            [note_content, id] 
        );
        res.json({"success": true})
    } catch (err) {
        console.error(err.message);
    }
})

// delete a note
app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleteNote = await pool.query("DELETE FROM notes WHERE notes_id = $1", 
            [id] 
        );
        res.json({"success": true})
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}.`)
})
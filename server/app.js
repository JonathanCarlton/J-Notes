const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const pool = require("./db");
dotenv.config();

//middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: false}))

// create a note
app.post('/notes', async (req, res) => {
    try {
        const {description} = req.body;
        const newNote = await pool.query(
            "INSERT INTO notes (description) VALUES($1) RETURNING *", 
            [description]
        );

        res.json(newNote.rows[0]);
    } catch (err) {
        console.error(err.message);    
    }
});

// get all notes
app.get('/notes', async(req, res) => {
    try {
        const allNotes = await pool.query("SELECT * FROM notes");
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
        const { description } = req.body;
        const updateNote = await pool.query("UPDATE notes SET description = $1 WHERE notes_id = $2", 
            [description, id] 
        );
        res.json("Note updated!")
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
        res.json("Note deleted!")
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}.`)
})
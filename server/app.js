const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// create
app.post('/insert', (req, res) => {

});

// read
app.get('/getAll', (req, res) => {
    res.json({
        success: true
    });
})
// update

// delete

app.listen(process.env.PORT, () => console.log(`App is running on port ${process.env.PORT}.`))
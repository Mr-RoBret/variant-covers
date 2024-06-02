require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const pool = require(__dirname + '/config/db.config.js');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// route functions
const getComics = (req, res) => {
    pool.query('SELECT * FROM comics', (error, comics) => {
        if (error) {
            throw error
        }
        res.status(200).json(comics.rows)
    })
}

const addComic = async (req, res) => {
    try {
        const { comic_id } = req.body;
        const newComic = await pool.query(
            "INSERT INTO comics (comic_id) VALUES($1)",
            [id]
        );
        res.json(newComic);
    } catch (err) {
        console.error(err.message);
    }
}
// get test
app.get('/', (req, res) => {
    res.send("hello world!");
});

// add a comic
// app.post('/comics', addComic);
app.post('/comics', async (req, res) => {
    try {
        const { comic_id } = req.body;
        const newComic = await pool.query(
            "INSERT INTO comics (comic_id) VALUES($1)",
            [comic_id]
        );
        res.json(newComic);
    } catch (err) {
        console.error(err.message);
    }
});

// get comics
app.get('/comics', getComics);

app.listen(5000, () => {
    console.log('server has started on port 5000');
});

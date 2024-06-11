require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const pool = require(__dirname + '/config/db.config.js');
const cors = require('cors');
// const proxy = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
// Enable CORS for specific routes
app.use(cors({
    origin: 'http://localhost:3000' // Replace with allowed origin
}));

// const proxyMiddleware = proxy({
//     target: `http://localhost:${PORT}`,
//     changeOrigin: true,
// });
// app.use('/comics', proxyMiddleware);

app.use(express.json());


/** route functions */

// get all comics
const getComics = async (req, res) => {

    pool.query('SELECT * FROM comics', (error, comics) => {
        if (error) {
            throw error
        }
        res.status(200).json(comics.rows)
    })
}

// get variant covers
const getVariants = async (req, res) => {
    try {
        const { comic_id } = req.params;
        const allVariants = await pool.query(
            "SELECT * FROM variants WHERE parent_id = $1",
            [comic_id], (error, comics) => {
                if (error) {
                    throw error
                }
                res.status(200).json(comics.rows)
            });
    } catch (err) {
        console.error(err.message);
    }
}

// add comic
const addComic = async (req, res) => {
    try {
        const { comic_id, comic_title } = req.body;
        const newComic = await pool.query(
            "INSERT INTO comics (comic_id, comic_title) VALUES($1, $2)",
            [comic_id, comic_title]
        );
        res.json(newComic);
    } catch (err) {
        console.error(err.message);
    }
}

// delete a comic
const deleteComic = async (req, res) => {
    try {
        const { comic_id } = req.params;
        const nukeComic = await pool.query(
            "DELETE FROM comics WHERE comic_id = $1",
            [comic_id]
        );
        res.json("comic deleted");
    } catch (err) {
        console.error(err.message);
    }
}

// delete all variants of comic
const deleteVariants = async (req, res) => {
    try {
        const { comic_id } = req.params;
        const deleteAllVariants = await pool.query(
            "DELETE FROM variants WHERE comic_id = $1",
            [comic_id]
        );
        res.json("variants deleted");
    } catch (err) {
        console.error(err.message);
    }
}

/** actual routes */

// get comics
app.get('/comics', getComics);

// add a comic
app.post('/comics', addComic);

// get variants
app.post('/variants/:comic_id', getVariants);

// delete a comic
app.delete('/comics/:comic_id', deleteComic);

// delete all variants of a comic
app.delete('/variants/:comic_id', deleteVariants);


app.listen(PORT, () => {
    console.log('server has started on port 5000');
});

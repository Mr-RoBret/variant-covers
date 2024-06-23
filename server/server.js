require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const schedule = require('node-schedule');
const pool = require(__dirname + '/config/db.config.js');
const cors = require('cors');
const md5 = require('md5');
// const proxy = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
// Enable CORS for specific routes
app.use(cors({
    origin: 'http://localhost:3000' // Replace with allowed origin
}));

app.use(express.json());

/** route functions */
// get all comics
const getComics = async (req, res) => {

    pool.query('SELECT * FROM comics;', (error, comics) => {
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
        const selectVariant = await pool.query(
            "SELECT image_url, image_artist, comic_id FROM variants WHERE comic_id = $1;",
            [comic_id],
        );
        res.json(selectVariant);
    } catch (err) {
        console.error(err.message);
    }
}

// add comic
const addComic = async (req, res) => {
    try {
        const { comic_id, comic_title } = req.body;
        const newComic = await pool.query(
            "INSERT INTO comics (comic_id, comic_title) VALUES($1, $2);",
            [comic_id, comic_title]
        );
        res.json(newComic);
    } catch (err) {
        console.error(err.message);
    }
}

// add a variant
const addVariants = async (req, res) => {
    try {
        const { comic_id, comic_title, image_url, image_artist } = req.body;
        const addVariant = await pool.query(
            "INSERT INTO variants (comic_id, comic_title, image_url, image_artist) VALUES($1, $2, $3, $4);",
            [comic_id, comic_title, image_url, image_artist]
        );
        res.json(addVariant);
    } catch (error) {
        console.error(error.message);
    }
}

// delete a comic
const deleteComic = async (req, res) => {
    try {
        const { comic_id } = req.params;
        const nukeComic = await pool.query(
            "DELETE FROM comics WHERE comic_id = $1;",
            [comic_id]
        );
        res.json("comic deleted");
    } catch (err) {
        console.error(err.message);
    }
}

// delete all variants of comic
const deleteVariants = async (res) => {
    // remove current list of comics
    try {
        const deleteAllVariants = await pool.query(
            "DELETE FROM variants WHERE comic_id IS NOT NULL;"
        );
        res.json(deleteAllVariants);
    } catch (err) {
        console.error(err.message);
    }
}

const queryMarvelAPI = async () => {
    console.log('Querying external API...');
    // Every 24 hours, call Marvel API to refresh database with new data
    // get new list of comics and parse into array of only comics with variants
    const privateKey = process.env.REACT_APP_API_SECRET;
    const publicKey = process.env.REACT_APP_API_PUBLIC;

    // create API fetch request params
    const currentTimeStamp = Date.now().toString();
    const currentDate = new Date().toISOString().split('T')[0];

    // Calculate the number of milliseconds in two weeks
    const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;

    // Subtract two weeks from the current date
    const twoWeeksAgo = new Date(currentTimeStamp - twoWeeksInMilliseconds);
    const prevDate = twoWeeksAgo.toISOString().split('T')[0];
    const dateRange = `${prevDate}, ${currentDate}`;
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);

    // refreshDB takes API data and maps week's titles into array of titles,
    // then, for each title, queries DB for variant data and sends data to "variants" table
    const refreshDB = async (response) => {
        const comicsWithVariantsOnly = Array.from(response.data.results);
        const newArray = comicsWithVariantsOnly.filter((item) => item.variants.length > 1);

        // for each comic_id i in newArray,
        // get list of variants, build query for each, and get variant data
        // then, post data to "variants" table
        const populateVariants = (newArrItem) => { // single title from comics table

            // Every 24 hours, call Marvel API to refresh responsebase with new data
            // get new list of comics and parse into array of only comics with variants
            const privateKey = process.env.REACT_APP_API_SECRET;
            const publicKey = process.env.REACT_APP_API_PUBLIC;

            // create API fetch request params
            const currentTimeStamp = Date.now().toString();
            const currentDate = new Date().toISOString().split('T')[0];
            // Calculate the number of milliseconds in two weeks
            const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000;
            // Subtract two weeks from the current date
            const twoWeeksAgo = new Date(currentTimeStamp - twoWeeksInMilliseconds);
            const prevDate = twoWeeksAgo.toISOString().split('T')[0];
            const dateRange = `${prevDate}, ${currentDate}`;
            const message = currentTimeStamp + privateKey + publicKey;
            const hash = md5(message);
            const parentID = newArrItem['id'];

            // 2. get IDs of variants
            const getIDs = (cover) => {
                const coverID = cover.resourceURI.split('/');
                return coverID[coverID.length - 1];
            }

            // 1. get Variants from response 
            // create new array from mapping fetched variants to getIDs(resoureURI).
            const getVariantIDs = (newArrItem) => {

                let newIDs = newArrItem.variants.map((cover) => getIDs(cover));

                return newIDs;
            }

            // 5. Formats image name and extension and returns
            const formatImageName = async (data) => {

                const fileName = data.data.results[0].thumbnail.path;
                const fileExtension = data.data.results[0].thumbnail.extension;

                /** get artist name if creators.items[item].role === "penciler (cover)" */
                const artistName = getArtistInfo(data.data.results[0].creators);
                const imageAndArtist = [fileName + '.' + fileExtension, artistName]
                return imageAndArtist;
            };

            // 2. function to dynamically replace comic ID# with ID passed in and build individual
            // variant request
            const requestVariantCovers = ((individualVariantID) => {
                return (`https://gateway.marvel.com:443/v1/public/comics/${individualVariantID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`);
            });

            // 1. Takes array of variant comic ID#s and maps to new array of request urls
            // (via calling requestVariantCovers function on each item)
            const variantURLs = getVariantIDs(newArrItem).map((item) => {
                const returnedCovers = requestVariantCovers(item);
                return returnedCovers;
            });

            // 4. Async function that passes data to formatting function and returns result
            const getVariantCovers = async (item) => {
                const response = await fetch(item);
                const data = await response.json();

                return await formatImageName(data);
            }

            // 3. Takes array of request urls and passes to async function
            // (getVariantCovers) for formatting; returns array of file names
            const returnedCovers = variantURLs.map((item) => {
                return getVariantCovers(item)
            });

            // 5. Once promise (returnedCovers) has been fulfilled, pushes items to
            // itemsArray and sets variantCovers to itemsArray
            Promise.allSettled(returnedCovers).then((items) => {
                const itemsArray = [];
                let index = 0;
                for (let item of items) {
                    // extract correct artist value (from around line 88 above) 
                    itemsArray.push({ key: index, value: item.value[0], artist: item.value[1] });
                    // add to database
                    try {
                        const id = newArrItem['id'];
                        const title = newArrItem['title'];
                        const url = itemsArray[index].value;
                        const artist = itemsArray[index].artist;

                        const requestURL = `http://localhost:5000/variants/${id}`
                        fetch(requestURL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                comic_id: id,
                                comic_title: title,
                                image_url: url,
                                image_artist: artist
                            })
                        }) // add database with above columns!!!

                    } catch (err) {
                        console.error(err.message);
                    }
                    index++;
                }
            });

            // function to get Artist info and return
            const getArtistInfo = (creators) => {
                let artistIndex = null;
                if (creators.items.find(item => item.role === 'penciler (cover)')) {
                    artistIndex = creators.items.findIndex(item => item.role === 'penciler (cover)');
                    return creators.items[artistIndex].name;
                }
                else if (creators.items.find(item => item.role === 'painter (cover)')) {
                    artistIndex = creators.items.findIndex(item => item.role === 'painter (cover)');
                    return creators.items[artistIndex].name;
                }
                else if (creators.items.find(item => item.role === 'colorist (cover)')) {
                    artistIndex = creators.items.findIndex(item => item.role === 'colorist (cover)');
                    return creators.items[artistIndex].name;
                } else {
                    return "artist unavailable";
                }
            }
        }

        // remove current list of comics
        try {
            const deleteAllComics = await pool.query(
                "DELETE FROM comics WHERE comic_id IS NOT NULL;"
            );
            res.json(deleteAllComics);
        } catch (err) {
            console.error(err.message);
        }

        // loop through newArray and add comics to table 'comics'
        for (let i in newArray) {
            try {
                const id = (newArray[i]['id']);;
                const title = newArray[i]['title'];

                await fetch('http://localhost:5000/comics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        comic_id: id,
                        comic_title: title
                    })
                });

                populateVariants(newArray[i]);

            } catch (err) {
                console.error(err.message);
            }
        }

    }

    const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateRange=${dateRange}&orderBy=title&limit=100&apikey=${publicKey}&hash=${hash}`;

    try {
        await fetch(requestTitles)
            .then(response => response.json())
            .then(data => refreshDB(data))

    } catch (error) {
        console.error(error.message);
    }
}


/** actual routes */

// get comics
app.get('/comics', getComics);

// add a comic
app.post('/comics', addComic);

// get variants
// app.get('/variants/:comic_id', getVariants);
app.get('/variants/:comic_id', getVariants);

// add variants
app.post('/variants/:comic_id', addVariants);

// delete a comic
app.delete('/comics/:comic_id', deleteComic);

// delete all variants of a comic
app.delete('/variants', deleteVariants);

const job = schedule.scheduleJob('0 0 * * *', queryMarvelAPI);
// const job = schedule.scheduleJob('* * * * *', queryMarvelAPI);

app.listen(PORT, () => {
    console.log('server has started on port 5000');
});


// const proxyMiddleware = proxy({
//     target: `http://localhost:${PORT}`,
//     changeOrigin: true,
// });
// app.use('/comics', proxyMiddleware);

import React, { useEffect } from 'react';
import md5 from 'md5';

const [variantIDs, setVariantIDs] = useState([]);
const [variantCovers, setVariantCovers] = useState([]);

const privateKey = process.env.REACT_APP_API_SECRET;
const publicKey = process.env.REACT_APP_API_PUBLIC;

const currentTimeStamp = Date.now().toString();
const message = currentTimeStamp + privateKey + publicKey;
const hash = md5(message);
const firstRender = FirstRender();

/** 
   * runs once list of variant IDs is obtained for each title.
  */

useEffect(() => {

    const getArtistInfo = (creators) => {
        let artistIndex = null;
        if (creators.items.find(item => item.role === 'penciler (cover)')) {
            artistIndex = creators.items.findIndex(item => item.role === 'penciler (cover)');
            // console.log(artistIndex);
            return creators.items[artistIndex].name;
        }
        else if (creators.items.find(item => item.role === 'painter (cover)')) {
            artistIndex = creators.items.findIndex(item => item.role === 'painter (cover)');
            // console.log(artistIndex);
            return creators.items[artistIndex].name;
        }
        else if (creators.items.find(item => item.role === 'colorist (cover)')) {
            artistIndex = creators.items.findIndex(item => item.role === 'colorist (cover)');
            // console.log(artistIndex);
            return creators.items[artistIndex].name;
        } else {
            return "artist unavailable";
        }
        // return creators.items[artistIndex].name;
    }

    if (!firstRender) {

        // 5. Formats image name and extension and returns
        const formatImageName = (data) => {
            const fileName = data.data.results[0].thumbnail.path;
            const fileExtension = data.data.results[0].thumbnail.extension;

            /** get artist name if creators.items[item].role === "penciler (cover)" */
            const artistName = getArtistInfo(data.data.results[0].creators);
            const imageAndArtist = [fileName + '.' + fileExtension, artistName]
            return imageAndArtist;
        };

        /** REPLACE */
        /** Replace this with query to database, and move this request to function 
         * that runs only if time conditions have been met 
        */
        // 2. function to dynamically replace comic ID# with ID passed in
        const requestVariantCovers = ((individualVariantID) => {
            return (`https://gateway.marvel.com:443/v1/public/comics/${individualVariantID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`);
        });

        // 1. Takes array of variant comic ID#s and maps to new array of request urls
        // (via calling requestVariantCovers function on each item)
        const variantURLs = variantIDs.map((item) => {
            return (requestVariantCovers(item));
        });

        // 4. Async function that passes data to formatting function and returns result
        async function getVariantCovers(item) {
            const response = await fetch(item);
            const data = await response.json();

            return formatImageName(data);
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

                /** 
                 * extract correct artist value (from around line 88 above) 
                 */
                itemsArray.unshift({ key: index, value: item.value[0], artist: item.value[1] });
                index++;
            }
            setVariantCovers(itemsArray);
            // console.log(itemsArray);
        });
    }

}, [variantIDs]);
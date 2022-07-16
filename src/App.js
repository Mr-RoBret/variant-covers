import React, { useEffect, useRef, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import { FirstRender } from './util/FirstRender';
import './App.css';
import Thumbnails from './components/Thumbnails';
import md5 from 'md5';

const App = () => {

  const [initialTitleID, setInitialTitleID] = useState(null);
  const [newTitleID, setNewTitleID] = useState(null);
  const [variantIDs, setVariantIDs] = useState([]);
  const [variantCovers, setVariantCovers] = useState([]);
  const [thumbIndex, setThumbIndex] = useState(0);

  const privateKey = process.env.REACT_APP_API_SECRET;
  const publicKey = process.env.REACT_APP_API_PUBLIC;

  const currentTimeStamp = Date.now().toString();
  const message = currentTimeStamp + privateKey + publicKey;
  const hash = md5(message);
  const firstRender = FirstRender();

  /** 
   * this side effect occurs upon selection of single title (newTitleID) 
   * from dropdown list of this week's issues.
  */
  useEffect(() => {

    setThumbIndex(0);

    if (!firstRender) {
      // 4. get IDs of variants
      const getIDs = (cover) => {
        const coverID = cover.resourceURI.split('/');
        return coverID[coverID.length-1];
      }
      
      // 3. get Variants from response and set variantIDs (state);
      // this will trigger next useEffect (below).
      const getVariantIDs = (res) => {  
        // create new array from mapping fetched variants to getIDs(resoureURI).
        let newIDs = res.data.results[0].variants.map((cover) => getIDs(cover));
        newIDs.push(newTitleID);
        setVariantIDs(newIDs);
      }
  
      // 2. function to construct API call url with either initial ID or new ID
      const constructRequestURL = (titleID) => {
        
        const requestVariants = `https://gateway.marvel.com:443/v1/public/comics/${titleID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;
        
        const fetchData = async() => {
          const data = await fetch(requestVariants);
          const json = await data.json();
          console.log('async #2 called');
          getVariantIDs(json);
        }
        
        fetchData()
        .catch(console.error);;
      }

      // 1. if there is a newTitleID returned, call constructRequest function
      if (newTitleID == null) {
        setNewTitleID(initialTitleID);
      } else {
        constructRequestURL(newTitleID);
      }
    }

  }, [newTitleID, initialTitleID]);

  /** 
   * runs when list of variant IDs is obtained variantIDs state changes.
  */

  useEffect(() => {

    if (!firstRender) {
      
      // 5. Formats image name and extension and returns
      const formatImageName = (data) => {
        const fileName = data.data.results[0].thumbnail.path;
        const fileExtension = data.data.results[0].thumbnail.extension;
        const artistName = data.data.results[0].creators.items[0].name;
        const imageAndArtist = [fileName + '.' + fileExtension, artistName]
        return imageAndArtist;
      };
  
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
        console.log('async #1 called');
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
          itemsArray.push({key: index, value: item.value[0], artist: item.value[1]});
          index++;
        }
        setVariantCovers(itemsArray);
      });
    }

  }, [variantIDs]);

  // component handlers

  const handleInitialTitle = (titleID) => {
    const titleIdString = titleID.toString();
    setInitialTitleID(titleIdString);
  }

  // handle selected option from Header/Dropdown
  const handleSelectedTitle = (titleObj, titleID) => {
    setNewTitleID(titleID); // setting to previous render's variables
  }

  const handleSelectedThumb = (index) => {
    setThumbIndex(index);
  }

  const updateThumbIndex = (index) => {
    setThumbIndex(index);
  }

  return (
    <div>
      <div>
        <Header onChange={handleSelectedTitle} onLoad={handleInitialTitle} />
        <div>
          <Carousel covers={variantCovers} coverIndex={thumbIndex} onChange={updateThumbIndex} />
        </div>
      </div>
      <div className="thumbnail-grid">
        <Thumbnails covers={variantCovers} onThumbSelect={handleSelectedThumb} />
      </div>
    </div>
  );
}

export default App;

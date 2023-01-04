import React, { useEffect, useState, useContext } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import { FirstRender } from './util/FirstRender';
import './App.css';
import md5 from 'md5';
import IndexContext from './store/index-context';

const App = () => {

  // const ctx = React.createContext(IndexContext)
  const [initialTitleID, setInitialTitleID] = useState(null);
  const [newTitleID, setNewTitleID] = useState(null);
  const [variantIDs, setVariantIDs] = useState([]);
  const [variantCovers, setVariantCovers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
 
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
          getVariantIDs(json);
        }
        fetchData()
        .catch(console.error);;
      }

      // 1. if there is a newTitleID returned, call constructRequest function
      if (newTitleID == null) {
        setNewTitleID(initialTitleID);
      } else {
        console.log(newTitleID);
        constructRequestURL(newTitleID);
      }
    }

  }, [newTitleID, initialTitleID]);

  /** 
   * runs when list of variant IDs is obtained variantIDs state changes.
  */

  useEffect(() => {
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

    if (!firstRender) {

      // 6. Gets image dimensions (to be used to size individual cards)
      const getImageWidth = (url) => {
        const img = new Image();
        img.src = url;
        img.onload = function() {
          // console.log('returned img.naturalWidth is ' + img.naturalWidth);
        }
        return img.naturalWidth;
      }
      const getImageHeight = (url) => {
        const img = new Image();
        img.src = url;
        img.onload = function() {
          // console.log('returned img.naturalHeight is ' + img.naturalHeight);
        }
        return img.naturalHeight;
      }
      
      // 5. Formats image name and extension and returns
      const formatImageName = (data) => {
        const fileName = data.data.results[0].thumbnail.path;
        const fileExtension = data.data.results[0].thumbnail.extension;
        /** get artist name if creators.items[item].role === "penciler (cover)" */
        const artistName = getArtistInfo(data.data.results[0].creators);
        const imageFileName = fileName + '.' + fileExtension;
        
        const returnedWidth = getImageWidth(imageFileName);
        const returnedHeight = getImageHeight(imageFileName);
        
        const imageAndArtist = [imageFileName, artistName, returnedWidth, returnedHeight]
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

          itemsArray.push({key: index, value: item.value[0], artist: item.value[1], width: item.value[2], height: item.value[3]});
          index++;
        }
        setVariantCovers(itemsArray);
        console.log(itemsArray);
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
    // setCurrentIndex(0);
  }

  return (
    <div>
      <div>
        <Header onChange={handleSelectedTitle} onLoad={handleInitialTitle} />
        <div>
            <IndexContext.Provider value={{
                  currentIndex: currentIndex,
                }}>
              <Carousel covers={variantCovers} />
            </IndexContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default App;

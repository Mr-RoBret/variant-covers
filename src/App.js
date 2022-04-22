import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import Card from './UI/Card';
import './App.css';
import md5 from 'md5';

import img1 from './images/slide-1.jpeg';

/**
 * App Component
 * @returns ...
 */

const App = () => {

  // declare useState variables
  const [newTitleArr, setNewtitleArr] = useState([]);
  const [newTitleID, setNewTitleID] = useState('92209');
  const [variantIDs, setVariantIDs] = useState([]);
  const [variantCovers, setVariantCovers] = useState([]);
  
  /** 
   ********************************* UseEffect #2 *********************************
   * this side effect will occur upon selection of single title from dropdown 
   * list of this week's issues.
   */
  useEffect(() => {
    // private and public key variables
    const privateKey = process.env.REACT_APP_API_SECRET;
    const publicKey = process.env.REACT_APP_API_PUBLIC;

    const currentTimeStamp = Date.now().toString();
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);
    // get ID of currently selected issue
    
    // get IDs of variants
    const getIDs = (coverURI) => {
      const coverIdArr = coverURI.split('/');
      return coverIdArr[coverIdArr.length-1]
    }
    
    // get Variants from response
    const getVariantIDs = (response) => {  
      // create new array from mapping fetched variants to getIDs(resoureURI).
      const coverIDsArr = response.data.results[0].variants.map(cover => (getIDs(cover.resourceURI)));

      // set variant covers to images retrieved (how to retrieve images? format file name and extension and return)
      setVariantIDs(coverIDsArr);
    }

    console.log(variantIDs);

    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestVariants = `https://gateway.marvel.com:443/v1/public/comics/${newTitleID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;
    
    fetch(requestVariants)
    .then(response => response.json())
    .then(data => getVariantIDs(data))
  }, [newTitleArr]);

  /** 
   ********************************* UseEffect #3 *********************************
   * runs when list of variant IDs is obtained from UseEffect #2 and variantCovers
   * state changes.
   */

  useEffect(() => {
    // private and public key variables
    const privateKey = process.env.REACT_APP_API_SECRET;
    const publicKey = process.env.REACT_APP_API_PUBLIC;

    const currentTimeStamp = Date.now().toString();
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);

    // formats image name and extension and returns to parseData
    const formatImageName = (cover) => {
      const fileName = cover.path;
      console.log(`fileName is ${fileName}`)
      const fileExtension = cover.extension;
      console.log(`fileExtension is ${fileExtension}`)
      const fullName = fileName + '.' + fileExtension;

      return (fullName);
    }

    // maps over variants requested from api and sends to format
    const parseData = (variants) => {
      const formattedVars = variants[0].map(cover => 
        (formatImageName(cover))
      );
      setVariantCovers(formattedVars);
    }
    
    // fetch data for images (and extensions) correlating with the above array
    // ** FETCH IMAGE DATA HERE FOR FORMATTING? **
    const requestVariantImages = `https://gateway.marvel.com:443/v1/public/comics/${newTitleID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;;
    
    // fetch list of titles from last week and send data to parseData function
    fetch(requestVariantImages)
      .then(response => response.json())
      .then(data => parseData(data));
  }, [variantIDs]);

  // handle selected option from Header/Dropdown
  const handleSelectedTitle = (newTitleObj, newTitleID) => {
    setNewtitleArr(newTitleObj);
    setNewTitleID(newTitleID);
  }

  return (
    <div>
      <div>
        <Header onChange={handleSelectedTitle} />
        <Card>
            <Carousel covers={variantCovers} />
        </Card>
      </div>
    </div>
  );
}

export default App;

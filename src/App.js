import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import Card from './UI/Card';
import './App.css';
import md5 from 'md5';

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
    const getIDs = (cover) => {
      const coverID = cover.resourceURI.split('/');
      return coverID[coverID.length-1]
    }
    
    // get Variants from response
    const getVariantIDs = (response) => {  
      // create new array from mapping fetched variants to getIDs(resoureURI).
      const coverIDsArr = response.data.results[0].variants.map((cover) => {
        console.log(cover.resourceURI);
        return (getIDs(cover));
      });

      // set variant covers to images retrieved (how to retrieve images? format file name and extension and return)
      console.log(variantIDs);
      setVariantIDs(coverIDsArr);
    }

    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestVariants = `https://gateway.marvel.com:443/v1/public/comics/${newTitleID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;
    
    fetch(requestVariants)
    .then(response => response.json())
    .then(data => getVariantIDs(data))
  }, [newTitleID]);

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
      const fileExtension = cover.extension;
      const fullName = fileName + '.' + fileExtension;

      return (fullName);
    }

    // maps over variants requested from api and sends to format
    const parseData = (res) => {
      const formattedVars = res.data.results[0].images.map(cover => 
        (formatImageName(cover))
      );
      console.log(`formattedVars is ${formattedVars}, setting variantCovers next...`);
      setVariantCovers(formattedVars);
      console.log(`variantCovers is ${variantCovers}; sending to Carousel!`);
    }
    
    console.log(variantIDs);
    // fetch data for images (and extensions) correlating with the above array
    // ** FETCH IMAGE DATA HERE FOR FORMATTING? **
    const requestVariantImages = `https://gateway.marvel.com:443/v1/public/comics/${newTitleID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;
    
    // fetch list of titles from last week and send data to parseData function
    fetch(requestVariantImages)
      .then(response => response.json())
      .then(data => parseData(data));
  }, [variantIDs]);

  // handle selected option from Header/Dropdown
  const handleSelectedTitle = (newTitleObj, newTitleId) => {
    setNewtitleArr(newTitleObj);
    setNewTitleID(newTitleId);
    console.log(`newTitleArr is ${newTitleArr}`);
    console.log(`newTitleID is ${newTitleId}`);
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

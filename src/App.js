import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import CarouselButton from "./UI/CarouselButton";
import Card from './UI/Card';
import './App.css';
import buttonImage from './images/left_arrow_transparent.png';
import md5 from 'md5';

/**
 * App Component
 */

const App = () => {

  // declare useState variables
  const [initialTitleID, setInitialTitleID] = useState(null);
  const [newTitleID, setNewTitleID] = useState(null);
  const [variantIDs, setVariantIDs] = useState([]);
  const [variantCovers, setVariantCovers] = useState([]);

  const privateKey = process.env.REACT_APP_API_SECRET;
  const publicKey = process.env.REACT_APP_API_PUBLIC;

  const currentTimeStamp = Date.now().toString();
  const message = currentTimeStamp + privateKey + publicKey;
  const hash = md5(message);
  /** 
   ********************************* UseEffect #2 *********************************
   * this side effect will occur upon selection of single title from dropdown 
   * list of this week's issues.
   */
  useEffect(() => {
    
    // get IDs of variants
    const getIDs = (cover) => {
      const coverID = cover.resourceURI.split('/');
      return coverID[coverID.length-1]
    }
    
    // get Variants from response
    const getVariantIDs = (res) => {  
      // create new array from mapping fetched variants to getIDs(resoureURI).
      let newIDs = res.data.results[0].variants.map((cover) => getIDs(cover));
      newIDs.push(newTitleID)
      setVariantIDs(newIDs);
    }

    // function to construct API call url with either initial ID or new ID

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
      
      

    if (newTitleID === null) {
      console.log('noTitleID yet');
      setNewTitleID(initialTitleID)
    }
    constructRequestURL(newTitleID)
    // setNewTitleID(initialTitleID);
    // console.log(newTitleID);

  }, [newTitleID, initialTitleID]);

  /** 
   ********************************* UseEffect #3 *********************************
   * runs when list of variant IDs is obtained from UseEffect #2 and variantCovers
   * state changes.
   */

  useEffect(() => {

    // formats image name and extension and returns to parseData
    const formatImageName = (data) => {
      const fileName = data.data.results[0].thumbnail.path;
      const fileExtension = data.data.results[0].thumbnail.extension;
      return (fileName + '.' + fileExtension);
    };

    //function to dynamically replace comic ID# with ID passed in
    const requestVariantCovers = ((individualVariantID) => {
      return (`https://gateway.marvel.com:443/v1/public/comics/${individualVariantID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`);
    });

    /**
     * Takes array of variant comic ID#s (['100813', '100772', '92209'], in this
     * case) and maps to new array of request urls. 
     * */
    const variantURLs = variantIDs.map((item) => {
      return (requestVariantCovers(item));
    });
    
    /**
     * For each url, fetch data and format as json. Then push to
     * array 'returnedVars'. 
     * */ 
    async function getVariantCovers(item) {
      const response = await fetch(item);
      const data = await response.json();
      return formatImageName(data);
    }
    
    const returnedCovers = variantURLs.map((item) => {
      return getVariantCovers(item)
    });

    Promise.allSettled(returnedCovers).then((items) => {
      const itemsArray = [];

      for (let item of items) {
        itemsArray.push({key: item.index, value: item.value});
      }
      setVariantCovers(itemsArray);
    })

  }, [variantIDs]);

  const handleInitialTitle = (titleID) => {
    console.log(`initial title id is ${titleID}`);
    const titleIdString = titleID.toString();
    console.log(typeof(titleIdString));
    setInitialTitleID(titleIdString);
    console.log(initialTitleID);
  }

  // handle selected option from Header/Dropdown
  const handleSelectedTitle = (titleObj, titleID) => {
    console.log(`in handleSelectedTitle, in App, titleObj is ${titleObj} and titleID is ${titleID}`);
    // setNewTitleArr(titleObj); // setting to previous render's variables
    setNewTitleID(titleID); // setting to previous render's variables
  }
  console.log(buttonImage);

  return (
    <div>
      <div>
        <Header onChange={handleSelectedTitle} onLoad={handleInitialTitle} />
          <CarouselButton src={buttonImage}/>
          <Card>
            <Carousel covers={variantCovers} />
          </Card>
          <CarouselButton />
      </div>
    </div>
  );
}

export default App;

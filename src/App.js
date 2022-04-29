import React, { useEffect, useState, useRef } from 'react';
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
  const [newTitleArr, setNewTitleArr] = useState([]);
  const [newTitleID, setNewTitleID] = useState('92209');
  const [variantIDs, setVariantIDs] = useState([]);
  const [variantCovers, setVariantCovers] = useState([]);

  // const variantIDs = useRef([]);

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
      console.log(res.data.results[0].variants);
      let newIDs = res.data.results[0].variants.map((cover) => getIDs(cover));
      newIDs.push(newTitleID)
      console.log(`newIDs array is ${newIDs}`);
      setVariantIDs(newIDs);
    }

    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestVariants = `https://gateway.marvel.com:443/v1/public/comics/${newTitleID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;
    
    // fetch(requestVariants)
    // .then(response => response.json())
    // .then(data => getVariantIDs(data))
    const fetchData = async() => {
      const data = await fetch(requestVariants);
      const json = await data.json();
      getVariantIDs(json);
    }

    fetchData()
      .catch(console.error);;

  }, [newTitleID]);

  /** 
   ********************************* UseEffect #3 *********************************
   * runs when list of variant IDs is obtained from UseEffect #2 and variantCovers
   * state changes.
   */

  useEffect(() => {

    // formats image name and extension and returns to parseData
    const formatImageName = (data) => {
      const fileName = data.data.results[0].images[0].path;
      const fileExtension = data.data.results[0].images[0].extension;
      // console.log(`fileName is ${data.data.results[0].images.path}, and fileExtension is ${fileExtension}`);
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
      // console.log(requestVariantCovers(item));
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
    console.log(typeof(returnedCovers));
    
    Promise.allSettled(returnedCovers).then((items) => {
      
      const itemsArray = [];
      for (let item of items) {
        itemsArray.push({key: item.index, value: item.value});
      }
      console.log(`itemsArray is ${itemsArray}`);
      setVariantCovers(itemsArray); // map here??
      console.log(`variantCovers is ${variantCovers}`);
    })
    // setVariantCovers(returnedCovers);

  }, [variantIDs]);

  // handle selected option from Header/Dropdown
  const handleSelectedTitle = (titleObj, titleID) => {
    console.log(`in handleSelectedTitle, in App, titleObj is ${titleObj} and titleID is ${titleID}`);
    setNewTitleArr(titleObj); // setting to previous render's variables
    setNewTitleID(titleID); // setting to previous render's variables
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

import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import Footer from './components/Footer';
// import { FirstRender } from './util/FirstRender';
import './App.css';
import IndexContext from './store/index-context';

const App = () => {

  const [initialTitleID, setInitialTitleID] = useState(null);
  const [newTitleID, setNewTitleID] = useState(null);
  const [variantIDs, setVariantIDs] = useState([]);
  const [variantCovers, setVariantCovers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coverWidth, setCoverWidth] = useState(window.innerWidth);
  const [returnedCoversData, setReturnedCoversData] = useState([]);

  window.onresize = () => {
    setCoverWidth(window.innerWidth);
  }

  /** 
   * this side effect occurs upon selection of single title (newTitleID) 
   * from dropdown list of this week's issues.
  */
  useEffect(() => {

    console.log('in useEffect in App');

    // 2. function to construct API call url with either initial ID or new ID
    const constructRequestURL = async (titleID) => {

      /** BUILD DATA FOR SENDING TO CAROUSEL */
      const setVariants = (variantObj) => {
        console.log(`variantObj.rows are: ${variantObj.rows}`);
        const itemsArray = [];
        let index = 0;

        // const variantArr = Array.from(variantObj);
        for (let item of variantObj.rows) {
          // itemsArray.unshift({ key: index, value: item.value[0], artist: item.value[1] });
          itemsArray.unshift({ key: index, value: item[0], artist: item[1] });
          index++;
        }

        console.log(itemsArray);
        setVariantCovers(itemsArray);
      }

      const requestVariants = `http://localhost:5000/variants/${titleID}`; // results in an array of variant 'rows'
      // ex.
      try {
        await fetch(requestVariants)
          .then(response => response.json())
          // .then(data => console.log(data))
          .then(data => setVariants(data))

      } catch (error) {
        console.error(error.message);
      }
    }

    // 1. if there is a newTitleID returned, call constructRequest function
    if (newTitleID == null) {
      setNewTitleID(initialTitleID);

    } else {
      console.log(`newTitleID is: ${newTitleID}`);
      constructRequestURL(newTitleID);
    }

  }, [newTitleID, initialTitleID]);

  // useEffect(() => {
  // 3. Takes array of request urls and passes to async function
  // (getVariantCovers) for formatting; returns array of file names
  // const returnedCovers = variantURLs.map((item) => {
  //   return getVariantCovers(item)
  // });

  // 5. Once promise (returnedCovers) has been fulfilled, pushes items to
  // itemsArray and sets variantCovers to itemsArray

  //   const itemsArray = [];
  //   let index = 0;
  //   for (let item of variantIDs) {

  //     /** 
  //      * extract correct artist value (from around line 88 above) 
  //      */
  //     // itemsArray.unshift({ key: index, value: item.value[0], artist: item.value[1] });
  //     itemsArray.unshift({ key: index, value: item });
  //     index++;
  //   }
  //   console.log(itemsArray);
  //   setVariantCovers(itemsArray);
  //   // console.log(itemsArray);



  // }, [variantIDs]);

  // component handlers
  const handleInitialTitle = (titleID) => {
    const titleIdString = titleID.toString();
    setInitialTitleID(titleIdString);
  }

  // handle selected option from Header/Dropdown
  const handleSelectedTitle = (titleObj, titleID) => {
    console.log(`titleID is ${titleID}`);
    console.log(`titleObj is ${titleObj}`);
    setNewTitleID(titleID); // setting to previous render's variables
  }

  return (
    <div>
      <div>
        <Header onChange={handleSelectedTitle} onLoad={handleInitialTitle} />
        <div>
          <IndexContext.Provider value={{
            currentIndex: currentIndex,
          }}>
            <Carousel covers={variantCovers} vw={coverWidth} />
          </IndexContext.Provider>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;

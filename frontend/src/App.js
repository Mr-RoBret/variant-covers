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
        console.log(variantObj);
        const itemsArray = [];
        let index = 0;
        const variantArr = variantObj.rows;
        // const variantArr = Array.from(variantObj);
        for (let row of variantArr) {
          // if (Array.isArray(row)) {
          // row.forEach(obj => {
          console.log(row['image_url']);
          console.log(row['image_artist']);
          // });
          // }
          // console.log(`item of variantArr is ${item[0]}`);
          // // itemsArray.unshift({ key: index, value: item.value[0], artist: item.value[1] });
          // itemsArray.unshift({ key: index, value: item[0], artist: item[1] });
          index++;
        }

        console.log(itemsArray);
        setVariantCovers(itemsArray);
      }

      // remove current list of variants
      const removeVariants = `http://localhost:5000/variants`;
      try {
        await fetch(removeVariants,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          })
      } catch (error) {
        console.error(error.message);
      }

      // get new list of variants
      const requestVariants = `http://localhost:5000/variants/${titleID}`; // results in an array of variant 'rows'
      try {
        await fetch(requestVariants)
          .then(response => response.json())
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


  // component handlers
  const handleInitialTitle = (titleID) => {
    const titleIdString = titleID.toString();
    setInitialTitleID(titleIdString);
  }

  // handle selected option from Header/Dropdown
  const handleSelectedTitle = (titleObj, titleID) => {
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

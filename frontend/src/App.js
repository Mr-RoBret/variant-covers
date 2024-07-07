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
  const [variantCovers, setVariantCovers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [coverWidth, setCoverWidth] = useState(window.innerWidth);

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
      const setVariants = async (variantObj) => {
        console.log(`variantObj is ${variantObj.rows}`);
        const itemsArray = [];
        let index = 0;
        const variantArr = variantObj.rows;

        for (let row of variantArr) {

          console.log(row);
          itemsArray.unshift({ key: index, value: row['image_url'], artist: row['image_artist'] });
          index++;
        }
        console.log(itemsArray);

        // console.log(itemsArray);
        setVariantCovers(itemsArray);
      }

      // get new list of variants
      const requestVariants = `${process.env.REACT_APP_API_URL}/variants/${titleID}`; // results in an array of variant 'rows'
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

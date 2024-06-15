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

  window.onresize = () => {
    setCoverWidth(window.innerWidth);
  }

  /** 
   * this side effect occurs upon selection of single title (newTitleID) 
   * from dropdown list of this week's issues.
  */
  useEffect(() => {



    // 2. function to construct API call url with either initial ID or new ID
    const constructRequestURL = (titleID) => {

      const requestVariants = `http://localhost:5000/variants/${titleID}`;

      const fetchData = async () => {
        const data = await fetch(requestVariants);
        const json = await data.json();
        console.log(json);
        // getVariantIDs(json);
      }

      fetchData()
      // .catch(console.error);
    }

    // 1. if there is a newTitleID returned, call constructRequest function
    if (newTitleID == null) {
      setNewTitleID(initialTitleID);
    } else {
      // console.log(newTitleID);
      constructRequestURL(newTitleID);
    }
    // }

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

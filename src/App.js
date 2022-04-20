import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import Card from './UI/Card';
import './App.css';
import md5 from 'md5';

import img1 from './images/slide-1.jpeg';
import img2 from './images/slide-3.jpeg';
import img3 from './images/slide-2.jpeg';

/**
 * App Component
 * @returns ...
 */

const App = () => {
  
  // static list of covers from "images" folder
  const defaultList = [
        {key: img1, src: img1}, 
        {key: img2, src: img2}, 
        {key: img3, src: img3}
  ];

  // declare useState variables
  const [newTitles, setNewTitles] = useState([]); 
  const [currentTitle, setCurrentTitle] = useState('')
  const [singleIssueCovers, setSingleIssueCovers] = useState(defaultList);
  const [currentTitleID, setCurrentTitleID] = useState('');

  // private and public key variables
  const privateKey = process.env.REACT_APP_API_SECRET;
  const publicKey = process.env.REACT_APP_API_PUBLIC;

  /** 
   ********************************* UseEffect #1 *********************************
   */
  
  useEffect(() => {
    // create API fetch request params
    const currentTimeStamp = Date.now().toString();
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);
    
    // parseData takes API data and maps week's titles into array of titles
    const parseData = (response) => {

      // map this week's titles into new array and setNewTitles to array
      const titlesArr = response.data.results.map(item => item.title
      );
      
      setNewTitles(titlesArr);
      
      // setCurrentTitleID to ID of first issue in list
      const titleID = response.data.results[0].id.toString();
      setCurrentTitleID(titleID);
      console.log(`currentTitleID is ${currentTitleID} and its type is ${typeof(currentTitleID)}`);
    }
      

    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateDescriptor=thisWeek&orderBy=title&limit=25&apikey=${publicKey}&hash=${hash}`;

    console.log(`reqeustTitles is ${requestTitles}`);
    
    // fetch list of titles from last week and send data to parseData function
    fetch(requestTitles)
    .then(response => response.json())
    .then(data => parseData(data));
  }, []);

  /** 
   ********************************* UseEffect #2 *********************************
   */

  // this side effect will occur upon selection of single title from dropdown list
  // of this week's issues.

  useEffect(() => {
    const currentTimeStamp = Date.now().toString();
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);

    // get ID of currently selected issue


    const coverImageID = currentTitleID; // this is wrong... only grabs the original first issue in the list's ID... needs to grab the selected issue's id, which can be handed up through the chain from where it's selected in the dropdown.?? Or can we grab the correct ID from the top level?


    console.log(`coverImageID is ${coverImageID} and its type is ${typeof(coverImageID)}. (line 91)`);

    const formatImageName = (cover) => {
      console.log(`cover is ${cover}`);
      const fileName = cover.path;
      const fileExtension = cover.extension;
      const fullName = fileName + '.' + fileExtension;
      console.log(`file's full name is ${fullName}.`);
      return (fullName);
    }

    const parseData = (response) => {
      // console.log(response.data.variants[0]);
      const coversArr = response.data.variants[0].map(cover => (formatImageName(cover)));
      console.log(coversArr);
      setSingleIssueCovers(coversArr);
    }
    console.log(`coverImageID sent to request is: ${coverImageID}`);

    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestVariantImage = `https://gateway.marvel.com:443/v1/public/comics/${coverImageID}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;
    console.log(requestVariantImage);
    
    fetch(requestVariantImage)
    .then(response => response.json())
    .then(data => parseData(data))
  }, [currentTitle]);


  // event handler for selected title from dropdown
  // sets currentTitle to the title selected
  const handleSelectedTitle = (newTitle) => {
    console.log(`from handleSelectedTitle: newTitle is ${newTitle}`);
    setCurrentTitle(newTitle);
  };

  return (
    <div>
      <div>
        <Header titlesList={newTitles} onChange={handleSelectedTitle} />
        <Card>
            <Carousel covers={singleIssueCovers} />
        </Card>
      </div>
    </div>
  );
}

export default App;

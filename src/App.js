import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import Card from './UI/Card';
import './App.css';
import md5 from 'md5';

import img1 from './images/slide-1.jpeg';
import img2 from './images/slide-3.jpeg';
import img3 from './images/slide-2.jpeg';


// request URL: https://gateway.marvel.com:443/v1/public/comics?format=comic&noVariants=true&dateDescriptor=thisWeek&orderBy=title&limit=25&apikey=8b985aedc4e35073e7b539df04cf3a31

//const imagesList = importAll(require.context('./images', false, /\.(png|pje?g|svg)$/));
const App = () => {
  
  const defaultList = [
        {key: img1, src: img1}, 
        {key: img2, src: img2}, 
        {key: img3, src: img3}
  ];

  const [newTitles, setNewTitles] = useState([]); 
  const [singleIssueCovers, setSingleIssueCovers] = useState(defaultList);
  const [currentTitleID, setCurrentTitleID] = useState('');

  const privateKey = process.env.REACT_APP_API_SECRET;
  const publicKey = process.env.REACT_APP_API_PUBLIC;
  
  useEffect(() => {
    const currentTimeStamp = Date.now().toString();
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);
    
    const parseData = (response) => {
      const titlesArr = response.data.results.map(item => item.title);
      const titleID = response.data.results[0].id;
      console.log(titlesArr);
      setNewTitles(titlesArr);
      setCurrentTitleID(titleID);
    }


    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=false&dateDescriptor=thisWeek&orderBy=title&limit=25&apikey=${publicKey}&hash=${hash}`;
    
    fetch(requestTitles)
    .then(response => response.json())
    .then(data => parseData(data));
  }, []);

  useEffect(() => {
    // request API again w/ variant image ID
    const currentTimeStamp = Date.now().toString();
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);

    const coverImage = currentTitleID;
    console.log(coverImage);

    const formatImageName = (response) => {
      const fileName = response.data.results[0].images[0].path;
      const fileExtension = response.data.results[0].images[0].extension;
      const fullName = fileName + '.' + fileExtension;
      console.log(`file's full name is ${fullName}.`);
      return (fullName);
    }

    const parseData = (response) => {
      const coversArr = response.data.results[0].variants.map(cover => (formatImageName(cover)));
      setSingleIssueCovers(coversArr);
    }
    
    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestVariantImage = `https://gateway.marvel.com:443/v1/public/comics/${coverImage}?&ts=${currentTimeStamp}&apikey=${publicKey}&hash=${hash}`;
    
    fetch(requestVariantImage)
    .then(response => response.json())
    .then(data => parseData(data))
  }, [privateKey, publicKey, currentTitleID]);

  const handleSelectedTitle = (newTitle) => {
    console.log(newTitle);
    // send newTitle to API and request covers
    // setCurrentTitle(newTitle);
    setCurrentTitleID(newTitle);
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

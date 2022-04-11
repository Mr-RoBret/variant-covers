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
  
  const defaultList = [ //get from API
        {key: img1, src: img1}, 
        {key: img2, src: img2}, 
        {key: img3, src: img3}
  ];

  //get from API
  const [newTitles, setNewTitles] = useState(['Option1', 'Option2', 'Option3']); 

  const privateKey = process.env.REACT_APP_API_SECRET;
  const publicKey = process.env.REACT_APP_API_PUBLIC;

  const parseData = (response) => {
    console.log(response);
    const titlesArr = response.data.results.map(item => item.title);
    
    console.log(titlesArr);
    setNewTitles(titlesArr);
  }

  useEffect(() => {
    const currentTimeStamp = Date.now().toString();
    const message = currentTimeStamp + privateKey + publicKey;
    const hash = md5(message);
    
    // hash.update(currentTimeStamp + privateKey + publicKey);
    const requestTitles = `https://gateway.marvel.com:443/v1/public/comics?&ts=${currentTimeStamp}&format=comic&noVariants=true&dateDescriptor=thisWeek&orderBy=title&limit=25&apikey=${publicKey}&hash=${hash}`;
    
    fetch(requestTitles)
    .then(response => response.json())
    .then(data => parseData(data));
  }, []);

  const [singleIssueCovers, setSingleIssueCovers] = useState(defaultList);

  const handleSelectedTitle = (newTitle) => {
    console.log(newTitle);
    // send newTitle to API and request covers
    // setCurrentTitle(newTitle);
    setSingleIssueCovers(defaultList);
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

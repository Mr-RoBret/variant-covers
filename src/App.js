import React, { useEffect, useState } from 'react';
import Carousel from './components/Carousel';
import Header from './components/Header';
import Card from './UI/Card';
import './App.css';

import img1 from './images/slide-1.jpeg';
import img2 from './images/slide-3.jpeg';
import img3 from './images/slide-2.jpeg';
//const imagesList = importAll(require.context('./images', false, /\.(png|pje?g|svg)$/));
const App = () => {
  
  const defaultList = [ //get from API
        {key: img1, src: img1}, 
        {key: img2, src: img2}, 
        {key: img3, src: img3}
  ];

  const [newTitles, setNewTitles] = useState(['Option1', 'Option2', 'Option3']); //get from API
  
  // useEffect(() => {
  //   fetch("https://gateway.marvel.com:443/v1/public/comics?orderBy=onsaleDate&limit=25&apikey=8b985aedc4e35073e7b539df04cf3a31")
  //   .then(response => response.json())
  //   .then(data => setNewTitles(data.message));
  // }, []);

  // const [currentTitle, setCurrentTitle] = useState(titlesList[0]);
  const [singleIssueCovers, setSingleIssueCovers] = useState(defaultList);

  const handleSelectedTitle = (newTitle) => {
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

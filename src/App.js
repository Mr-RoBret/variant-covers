import React, { useState } from 'react';
import Carousel from './components/Carousel';
import TitleSelector from './UI/TitleSelector';
import Slide from './components/Slide';
import './App.css';

//const imagesList = importAll(require.context('./images', false, /\.(png|pje?g|svg)$/));
const App = () => {

  const [coversList, setCoversList] = useState([]);

  const handleSelectedTitle = (props) => {
    const retrievedImages = props.imagesList.map((img) => {
        return <Slide key={img} img={img} />
    });
    setCoversList(retrievedImages);
    console.log(`coversList (state) is currently: ${coversList}`);
  }

  return (
    <div>
      <div className="App">
        <TitleSelector onSelected={handleSelectedTitle} />
        <Carousel covers={coversList} />
      </div>
    </div>
  );
}

export default App;

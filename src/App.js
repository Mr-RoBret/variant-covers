import React, { useState } from 'react';
import Carousel from './components/Carousel';
import Header from './UI/Header';
import Card from './UI/Card';
import './App.css';

//const imagesList = importAll(require.context('./images', false, /\.(png|pje?g|svg)$/));
const App = () => {

  const [singleIssueList, setSingleIssueList] = useState([]);

  const handleNewList = (coversList) => {
    setSingleIssueList(coversList);
  };

  return (
    <div>
      <div className="app-header">
        <Header onChange={handleNewList} />
        <Card>
          <Carousel covers={singleIssueList} />
        </Card>
      </div>
    </div>
  );
}

export default App;

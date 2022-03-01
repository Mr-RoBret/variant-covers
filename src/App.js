import React, { useState } from 'react';
import Carousel from './components/Carousel';
import './App.css';

const App = props => {
  const [coversList, setCoversList] = useState([]);
  const title = props.title;
  const issue = props.issue;

  return (
    <div>
      <header>

      </header>
      <div className="App">
        <Carousel title={title} issue={issue} covers={coversList} />
      </div>
    </div>
  );
}

export default App;

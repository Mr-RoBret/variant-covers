import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// const connection = () => {
//   const xhr = new XMLHttpRequest()
//   xhr.open('GET', './connections/get-data', true)
//   xhr.onloadstart = () => {

//   }
//   xhr.onerror = () => {

//   }
//   xhr.onload = () => {
//     if (this.status == 200) {
//       console.log(this.textResponse);
//     } else {

//     }
//   }
//   xhr.onloadend = () => {

//   }
//   xhr.send;
// }

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


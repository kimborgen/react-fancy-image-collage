import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FancyImageCollage from './FancyImageCollage';

const images = [
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
  "https://via.placeholder.com/150",
]

ReactDOM.render(<FancyImageCollage images={images} numOfImages={8} />, document.getElementById('root'));

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import FancyImageCollage from './FancyImageCollage';

const images = [
  "https://scontent.cdninstagram.com/vp/1eeae3c20f54a6299b05cf6ca97130f1/5CC3E98A/t51.2885-15/sh0.08/e35/s640x640/46240342_1166188130210674_2743516703902412432_n.jpg?_nc_ht=scontent.cdninstagram.com",
  "https://ia800209.us.archive.org/24/items/WildlifeSampleVideo/Wildlife.mp4",
  "https://scontent.cdninstagram.com/vp/ee1ac2580b44e4482fa07c4a283da292/5CD346E6/t51.2885-15/sh0.08/e35/s640x640/47691392_2400326876708383_6408963024116338633_n.jpg?_nc_ht=scontent.cdninstagram.com",
  "https://scontent.cdninstagram.com/vp/9507810c6e1c352c696ad73f88a1738a/5CB8C4D2/t51.2885-15/sh0.08/e35/s640x640/46556322_126668791673458_3700263616577987073_n.jpg?_nc_ht=scontent.cdninstagram.com",
  "https://via.placeholder.com/150.png",
]

ReactDOM.render(<FancyImageCollage images={images} numOfImages={8} />, document.getElementById('root'));

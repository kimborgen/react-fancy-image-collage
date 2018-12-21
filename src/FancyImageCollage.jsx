import React, { Component } from 'react';
import './fancyImageCollage.css';
import PropTypes from 'prop-types';

/// main component
class FancyImageCollage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      images: [],
      screenWidth: window.innerWidth,
      screenHeigth: window.innerHeigth,
    }
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDim);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDim);
  }

  static getDerivedStateFromProps = (props,state) => {
    console.log(props.images)
    /// if images prop contains more than the wanted number of images then reduce to exact
    const shuffled = props.images.sort(() => .5 - Math.random())  
    //get sub-array of first n elements AFTER shuffle 
    let selected = shuffled.slice(0, props.numOfImages)
    console.log(selected)
    return { images: selected }
  }

  // on screen rezizing event, update variables
  updateWindowDim = () => {
    this.setState({
      screenWidth: window.innerWidth,
      screenHeigth: window.innerHeigth,
    })
  }

  render() {
    return (
      <div className="fancy-image-collage">
             
      </div>
    );
  }
}

FancyImageCollage.propTypes = {
  images: PropTypes.array.isRequired,
  numOfImages: PropTypes.number.isRequired,
}

export default FancyImageCollage;

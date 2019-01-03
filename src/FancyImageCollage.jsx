import React, { Component } from 'react'
import './fancyImageCollage.css'
import PropTypes from 'prop-types'
import styled from 'styled-components'
var _ = require('lodash')

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`

const HiddenImg = styled.img`
  width: 100%;
height: 100%;
display: none;
`

/// main component
class FancyImageCollage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      urls: [],
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      canvasWidth: 1000,
      canvasHeight: 1000,
    }
    this.objRefs = []
  }
  
  componentDidMount() {
    window.addEventListener('resize', this.updateWindowDim);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDim);
  }

  static getDerivedStateFromProps = (props,state) => {
    /// if images prop contains more than the wanted number of images then reduce to exact
    //const shuffled = props.images.sort(() => .5 - rndInterval())  
    //get sub-array of first n elements AFTER shuffle 
    //let selected = shuffled.slice(0, props.numOfImages)

    return { urls: props.images }
  }

    // Divide pictures into containers
    let nImages = props.numOfImages
    console.log("number of images: ", nImages)
    
  makeRefs = () => {
    let objs = []
    for (let url of this.state.urls) {
      if (url.includes("png") || url.includes("jpg") || url.includes("jpeg")) {
        let img = new Image()
        img.src = url
        objs.push(img)
      } else {
        let video = document.createElement("video")
        video.src = url
        video.autoPlay = true
        video.loop = true
        video.muted = true
        video.play()
        objs.push(video)
  }
    }
    this.objRefs = objs
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
      <Container>
        <canvas className="canvas" ref="canvas" 
          width={this.state.canvasWidth} height={this.state.canvasHeight} />
          {
          this.state.urls.map((url, index) => {
            if (url.includes("png") || url.includes("jpg") || url.includes("jpeg")) {
              return <HiddenImg src={url} ref={this.refs[index]} />
            } else {
              return <video autoPlay loop src={url} ref={this.refs[index]} style={{"display": "none", "width": "100%", "height": "1000%"}}/>
            } 
            })
          }                
        
      </Container>
    );
  }
}

FancyImageCollage.propTypes = {
  images: PropTypes.array.isRequired,
  numOfImages: PropTypes.number.isRequired,
}

export default FancyImageCollage;

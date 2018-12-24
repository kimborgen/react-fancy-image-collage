import React, { Component } from 'react'
import './fancyImageCollage.css'
import PropTypes from 'prop-types'
import styled from 'styled-components'

let minPics = 2
let maxPics = 8
let minSplit = 2
let maxSplit = 4

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width:  50vw;
  heigth: 50vh;
  border: 1px solid yellow;
`

const Img = styled.img`
  width: 100%;
`

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
    /// if images prop contains more than the wanted number of images then reduce to exact
    const shuffled = props.images.sort(() => .5 - Math.random())  
    //get sub-array of first n elements AFTER shuffle 
    let selected = shuffled.slice(0, props.numOfImages)

    let imageGrid = []

    // Divide pictures into containers
    let nImages = props.numOfImages
    console.log("number of images: ", nImages)
    
    // Find out how many containers we should split into 
    let rndSplit = Math.random(minSplit, maxSplit)
    console.log("RndSplit: ", rndSplit)
  
    let averagePicsPerSplit = Math.floor(nImages / rndSplit)
    
    // mix the average by a small random value
    let mixAverage = Math.random(averagePicsPerSplit / minPics)
    console.log("mixAverage: ", mixAverage)
    
    // find the images per split 
    let nImagesPerSplit = []
    return { images: imageGrid }
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
        <Container>
          {
            this.state.images.map((image) => {
              return <Img />
            })
          }                
        </Container>
      </Container>
    );
  }
}

FancyImageCollage.propTypes = {
  images: PropTypes.array.isRequired,
  numOfImages: PropTypes.number.isRequired,
}

export default FancyImageCollage;

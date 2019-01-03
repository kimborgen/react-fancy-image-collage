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



function rndInterval(min,max) // min and max included
{
  if (max < min) {
    let tmpMax = max
    max = min
    min = tmpMax 
  }
  return Math.floor(Math.random()*(max-min+1)+min);
}


class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Line {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
  }
}

/// main component
class FancyImageCollage extends Component {

  constructor(props) {
    super(props)
    this.state = {
      urls: [],
      shapes: [],
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      canvasWidth: 1000,
      canvasHeight: 1000,
    }
    this.objRefs = []
  }
  
  async componentDidMount() {
    window.addEventListener('resize', this.updateWindowDim);
    this.makeRefs()
    await this.generateLayout()
    //await this.strokeShapes()
    await this.orderShapes()
    console.log("Debug this.state.shapes before draw", this.state.shapes)
    await this.draw()
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
      screenHeight: window.innerHeight,
    })
  }
  drawShape = (c, pattern, scaleX, scaleY, shape) => {
    console.log("Debug: drawShape: shape ", shape)
    c.fillStyle = pattern
    c.beginPath()
    c.moveTo(shape[0].p1.x, shape[0].p1.y)
    for (let i = 0; i < shape.length; i++) {
      c.lineTo(shape[i].p2.x, shape[i].p2.y)
    }
    c.closePath()
    //c.stroke()
    c.scale(scaleX, scaleY)
    c.fill()
    c.setTransform(1,0,0,1,0,0)
  }
  draw = () => {
    console.log("Debug: draw: objRefs ", this.objRefs)
    const canvas = this.refs.canvas
    let c = canvas.getContext("2d")
    for (let i = 0; i < this.state.shapes.length; i++) {
      let pattern = c.createPattern(this.objRefs[i], "no-repeat")
      console.log("Debug: draw: pattern ", pattern, " with obj: ", this.objRefs[i])
      if (this.objRefs[i].toString().includes("Image")) {
        this.objRefs[i].onload = () => {
          console.log("Debug: draw: drawing image ", i)
          let scaleX = this.state.canvasWidth / this.objRefs[i].width
          let scaleY = this.state.canvasHeight / this.objRefs[i].height
          this.drawShape(c, pattern, scaleX, scaleY, this.state.shapes[i])
        }
      } else if (this.objRefs[i].toString().includes("Video")) {
        let video = this.objRefs[i]
        let canvasWidth = this.state.canvasWidth
        let canvasHeight = this.state.canvasHeight
        video.addEventListener('loadedmetadata', () => {
          console.log("Debug: draw: drawing video ", i)
          let scaleX = canvasWidth / video.videoWidth
          let scaleY = canvasHeight / video.videoHeight
          console.log("Debug: draw: step: ", video.videoWidth)
          let shape = this.state.shapes[i]
          function step() {
            //console.log("Debug: draw: video ", i, " step", video)
            let pattern = c.createPattern(video, "no-repeat")
            c.fillStyle = pattern
            c.beginPath()
            c.moveTo(shape[0].p1.x, shape[0].p1.y)
            for (let i = 0; i < shape.length; i++) {
              c.lineTo(shape[i].p2.x, shape[i].p2.y)
            }
            c.closePath()
            //c.stroke()
            c.scale(scaleX, scaleY)
            c.fill()
            c.setTransform(1,0,0,1,0,0)
            requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        })
      
      } else {
        console.log("Error: The element was neither an image or a video")
      }
    }
  }
  generateLayout = async () => {
    let corner0 = new Point(0,0)
    let corner1 = new Point(this.state.canvasWidth, 0)
    let corner2 = new Point(this.state.canvasWidth, this.state.canvasHeight)
    let corner3 = new Point(0,this.state.canvasHeight)

    let cornerLine0 = new Line(corner0, corner1)
    let cornerLine1 = new Line(corner1, corner2)
    let cornerLine2 = new Line(corner2, corner3)
    let cornerLine3 = new Line(corner3, corner0)

    let startShape =  [ cornerLine0, cornerLine1, cornerLine2, cornerLine3 ]   
    await this.setState( {
      shapes: [ startShape ] 
    })
    
    //await this.findLine()
    
    for (let i = 0; i < this.state.urls.length - 1; i++) {
      await this.findLine()
    }
    console.log("Debug: this.state.shapes: ", JSON.parse(JSON.stringify(this.state.shapes))) 
    // this.strokeShapes(c)
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

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

  /*
  /// Draw the layout
  tmpdrawLayout = () => {
    const canvas = this.refs.canvas
    let c = canvas.getContext("2d")
    let firstImg = this.state.objs[0]
    let video = this.state.objs[1]
    let firstImagePattern = c.createPattern(firstImg, "no-repeat")
    video.addEventListener('play', () => {
      function step() {
        let videoPattern = c.createPattern(video, "no-repeat")
        c.fillStyle = videoPattern
        let scaleFactorX = 1000 / video.videoWidth 
        let scaleFactorY = 1000 / video.videoHeight 
        c.beginPath()
        c.moveTo(0,0)
        c.lineTo(1000, 0)
        c.lineTo(1000, 1000)
        c.closePath()
        c.scale(scaleFactorX, scaleFactorY)
        c.fill()
        c.stroke()
        c.setTransform(1, 0, 0, 1, 0, 0);
        requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    })

    firstImg.onload = () => {
      let objDim = [firstImg.width, firstImg.height]
      let p1 = [0,0]
      let p2 = [0,1000]
      let p3 = [1000,1000]
      this.drawTriangle(c, firstImg, objDim, p1, p2 ,p3)
    }
  }
  */

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

  // line 1 stays the same, line2 either placed in front or back 
  orderPoints = (line1,line2) => {
    line2 = _.cloneDeep(line2)
    console.log("Debug: orderPoints: line1 and line2", line1, line2)
    if (line1.p1.x === line2.p1.x && line1.p1.y === line2.p1.y) {
      // place <- , and switch p1 and p2
      console.log("Debug: orderPoints: 1")
      let tmpP1 = _.cloneDeep(line2.p1)
      line2.p1 = _.cloneDeep(line2.p2)
      line2.p2 = tmpP1
      return [false, line2]
    } else if (line1.p1.x === line2.p2.x && line1.p1.y === line2.p2.y) {
      console.log("Debug: orderPoints: 2")
      // place <- , do nothing
      return [false, line2]
    } else if (line1.p2.x === line2.p1.x && line1.p2.y === line2.p1.y) {
      // place -> , do nothing
      console.log("Debug: orderPoints: 3")
      return [true, line2]
    } else if (line1.p2.x === line2.p2.x && line1.p2.y === line2.p2.y) {
      // place -> , switch p1 and p2
      console.log("Debug: orderPoints: 4")
      let tmpP1 = _.cloneDeep(line2.p1)
      line2.p1 = _.cloneDeep(line2.p2)
      line2.p2 = tmpP1
      return [true, line2]
    } else {
      console.log("Error: what")
    }
  }

  orderLines = (shape) => {
    console.log("Debug: orderLines: original shape: ", shape)
    let iCurrentLine = 0
    let newShape = [ shape[ iCurrentLine ] ]
    shape = shape.slice(1,shape.length)
    while(shape.length != 0) {
      for (let i = 0; i < shape.length; i++) {
        console.log("Debug: orderLines: newShape before if", iCurrentLine, newShape)
        if (this.lineTouch(newShape[iCurrentLine], shape[i])) {
          let ret = this.orderPoints(newShape[iCurrentLine], shape[i])
          console.log("Debug: orderLines: iCur", iCurrentLine)
          if (!ret[0]) { 
            newShape.splice(iCurrentLine,0, ret[1])
          } else {
            newShape.splice(iCurrentLine + 1,0, ret[1])
          }
          console.log("Debug: orderLines: newShape", newShape)
          shape = shape.slice(0,i).concat(shape.slice(i+1,shape.length))
          break
        }
      }
      iCurrentLine++
    }
    console.log("Debug: orderLines: after shape: ", newShape)
    return newShape
  }

  orderShapes = async () => {
    let shapes = _.cloneDeep(this.state.shapes)
    let newShapes = []
    for (let shape of shapes) {
      let newShape = this.orderLines(_.cloneDeep(shape))
      if (newShape.length !== shape.length) {
        console.log("Error: newShape not of same length")
      }
      newShapes.push(newShape)
    }
    await this.setState({
      shapes: newShapes
    })
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

  strokeShapes = () => { 
    const canvas = this.refs.canvas
    let c = canvas.getContext("2d")
    console.log("Drawing this: ", this.state.shapes)
    let s = -1
    for (let shape of this.state.shapes) {
      s++
      for (let i = 0; i < shape.length; i++) {
        console.log("whaW")
        let line = shape[i]
        c.moveTo(line.p1.x, line.p1.y)
        c.lineTo(line.p2.x, line.p2.y)
        c.stroke()
        c.font = "15px georgia"
        let x = Math.min(line.p1.x, line.p2.x) + 0.5 * Math.max(line.p2.x, line.p1.x)
        let y = Math.min(line.p1.y, line.p2.y) + 0.5 * Math.max(line.p2.y, line.p1.y)
        if (x > 970) x = 970
        if (x < 30) x = 30
        if (y > 970) y = 970
        if (y < 30) y = 30
        c.fillText(s + "," + i, x, y) 
      }
    }
  }

  btnPress = () => {

    this.findLine()

    console.log("Debug: this.state.shapes: ", JSON.parse(JSON.stringify(this.state.shapes)))
    
    const canvas = this.refs.canvas
    let c = canvas.getContext("2d")
    this.strokeShapes(c)
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

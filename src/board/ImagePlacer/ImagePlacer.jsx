import React from 'react'
import PropTypes from 'prop-types'
import { Icon, Button } from 'antd'


import styles from './ImagePlacer.scss'

class ImagePlacer extends React.Component {
  
  static propTypes = {
    width: PropTypes.number, // 初始图片容器宽度
    height: PropTypes.number, // 初始图片容器高度
    cancel: PropTypes.func, // 取消上传图片
    place: PropTypes.func, // function(stroke:Stroke) { ... }
  }

  static defaultProps = {
    image: null,
    color: '#000',
    size: 5
  }

  constructor(props) {
    super(props)
  }

  state = {
    width: 500,
    height: 500,
    posX: 200,
    posY: 200,
  }

  componentDidMount() {
    const image = this.image
    this.image.onload = () => {
      this.setState({
        scale: (image.height) / image.width
      })
    }
  }

  handleStartDrag = (e) => {
    const imagePlacer = this.imagePlacer
    const x = imagePlacer.offsetLeft - e.clientX, y = imagePlacer.offsetTop - e.clientY
    
    const drag = (e) => {
      this.setState({
        posX: e.clientX + x,
        posY: e.clientY + y
      })
    }

    const stopDrag = () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', stopDrag)
    }

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', stopDrag)
  }

  handleClick = (e) => {
    const { offsetLeft, offsetTop, image } = this.props
    const { posX, posY, width } = this.state
    const height = this.image.height
    
    this.props.place({
      top: posY + offsetTop,
      left: posX + offsetLeft,
      width,
      height,
      imgData: image
    })
  }

  handleCancel = (e) => {
    this.setState({
      width: 500,
      height: 500,
      posX: 200,
      posY: 200, 
    })
    this.props.cancel()
  }

  handleMouseDown = (e, tag) => {
    e.stopPropagation()
    const startX = e.clientX
    const startWidth = this.state.width
    const scale = this.state.scale
    const startPosX = this.state.posX
    const startPosY = this.state.posY
    const move = (e) => {
      let diffX = (e.clientX - startX) * tag
      
      this.setState({
        posX: startPosX - (diffX / 2),
        posY: startPosY - (diffX / 2) * scale, 
        width: startWidth + diffX,
      })
    }

    const stopMove = (e) => {
      
      document.removeEventListener('mousemove', move)
      document.removeEventListener('mouseup', stopMove)
    }

    document.addEventListener('mousemove', move)
    document.addEventListener('mouseup', stopMove)
  }

  render() {
    const { image, offsetLeft, offsetTop } = this.props
    const { width, posX, posY } = this.state

    return (
      <div 
        className={styles.spinnable}
        style={{
          top: `${offsetTop}px`,
          left: `${offsetLeft}px`
        }}
      >
        <div 
          className={styles.imagePlacer} 
          style={{
            top: `${posY}px`,
            left: `${posX}px`
          }}
          onMouseDown={this.handleStartDrag}
          ref={(r) => this.imagePlacer = r}
        >
          <div className={styles.rotate}>
            <div className={styles.dropElements}>
              <div className="grip tl" onMouseDown={(e) => this.handleMouseDown(e, -1)}></div>
              <div className="grip tr" onMouseDown={(e) => this.handleMouseDown(e, 1)}></div>
              <div className="grip bl" onMouseDown={(e) => this.handleMouseDown(e, -1)}></div>
              <div className="grip br" onMouseDown={(e) => this.handleMouseDown(e, 1)}></div>
            </div>
            <img
              style={{
                display: 'block',
                width: `${width}px`,
              }}
              className={styles.img}
              src={image}
              ref={(img) => this.image = img}
            />
          </div>
          <div className={styles.dropButtons}>
            <div className={styles.close}>
              <Icon type="close" style={{ color: '#f7412d', fontSize: '18px' }} onClick={this.handleCancel}/>
            </div>
            <div className={styles.placeButton}>
              <Button type="primary" size={'large'} onClick={this.handleClick}>放置图片</Button>
            </div>
          </div>
        </div>
      </div>
      
    )
  }
}

export default ImagePlacer
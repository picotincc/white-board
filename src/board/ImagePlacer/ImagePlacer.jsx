import React from 'react'
import PropTypes from 'prop-types'
import styles from './ImagePlacer.scss'

class ImagePlacer extends React.Component {
  
  static propTypes = {
    width: PropTypes.number, // 初始图片容器宽度
    height: PropTypes.number, // 初始图片容器高度
    onItemStart: PropTypes.func, // function(stroke:Stroke) { ... }
  }

  static defaultProps = {
    width: 500,
    height: 500,
    color: '#000',
    size: 5
  }

  constructor(props) {
    super(props)
  }

  state = {
    posX: 0,
    posY: 0,
  }

  componentDidMount() {

  }

  render() {
    return (

    )
  }
}
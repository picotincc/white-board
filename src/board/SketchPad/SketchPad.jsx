import React from 'react'
import PropTypes from 'prop-types'
import { v4 } from 'uuid'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames'
import { message } from 'antd'
import { Pencil, TOOL_PENCIL, Line, TOOL_LINE, Ellipse, TOOL_ELLIPSE, Rectangle, TOOL_RECTANGLE } from '../tools'
import { REMOTE_OPERATION, OPERATION_TYPE } from '../ConstantUtil'
import styles from './SketchPad.scss'
import { fromJS } from 'immutable'
import ImagePlacer from '../ImagePlacer'

export const toolsMap = {
  [TOOL_PENCIL]: Pencil,
  [TOOL_LINE]: Line,
  [TOOL_RECTANGLE]: Rectangle,
  [TOOL_ELLIPSE]: Ellipse
}

export default class SketchPad extends React.Component {

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    animate: PropTypes.bool,
    canvasClassName: PropTypes.string,
    color: PropTypes.string,
    fillColor: PropTypes.string,
    size: PropTypes.number,
    tool: PropTypes.string,
    toolsMap: PropTypes.object,
    onItemStart: PropTypes.func, // function(stroke:Stroke) { ... }
    onEveryItemChange: PropTypes.func, // function(idStroke:string, x:number, y:number) { ... }
    onDebouncedItemChange: PropTypes.func, // function(idStroke, points:Point[]) { ... }
    onCompleteItem: PropTypes.func, // function(stroke:Stroke) { ... }
    debounceTime: PropTypes.number,
  }

  static defaultProps = {
    width: 500,
    height: 500,
    color: '#000',
    size: 5,
    fillColor: '',
    canvasClassName: 'canvas',
    debounceTime: 1000,
    animate: true,
    tool: TOOL_PENCIL,
    toolsMap
  };

  constructor(props) {
    super(props)
    this.initTool = this.initTool.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)

    this._cacheImgs = {}
  }

  state = {
    isTexting: false,
    isDragging: false,
    isScrolling: false,
    isUploading: false,
    uploadImage: null, 
    startDragPoint: null,
    selectedRect: null,
    selectedItems: []
  }



  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef)
    this.ctx = this.canvas.getContext('2d')

    this.initTool(this.props.tool)
  }

  componentWillReceiveProps({ tool, items, remoteType }) {
    let newItems = []
    const ids = this.props.items.map((i) => i.id)
    switch (remoteType) {
      case REMOTE_OPERATION.INCREMENT:
        newItems = items.filter((item) => ids.indexOf(item.id) === -1)
        this.renderItems(newItems, true)
        break
      case REMOTE_OPERATION.DECREMENT:
        this._clear()
        this.renderItems(items)
        break
      default:
        break
    }
    this.initTool(tool)
  }

  componentDidUpdate({ scale }) {
    if (this.props.scale !== scale) {
      // this.relocateCanvas(scale)
      this._clear()
      this.renderItems(this.props.items)
    }
  }

  tool = null
  interval = null

	// canvas 事件 mousedown, mousemove, mouseup
  onMouseDown(e) {
    const { operation } = this.props

    switch (operation) {
      case OPERATION_TYPE.DRAW_LINE:
        this.onDrawlineMouseDown(e)
        break
      case OPERATION_TYPE.DRAW_SHAPE:
        this.onDrawlineMouseDown(e)
        break
      case OPERATION_TYPE.CLEAR:
        this.onCleanMouseDown(e)
        break
      case OPERATION_TYPE.TEXT:
        this.onrenderTextArea(e)
        break
      case OPERATION_TYPE.INSERT_PIC:
        this.onInsertPic(e)
        break
      case OPERATION_TYPE.SELECT:
        this.onSelectMouseDown(e)
        break
      case OPERATION_TYPE.DRAG:
        this.onDragMouseDown(e)
        break
      default:
        break
    }

  }

  onMouseMove(e) {
    const { operation } = this.props
    const { isDragging, isScrolling } = this.state

    switch (operation) {
      case OPERATION_TYPE.SELECT:
        if (!isDragging) {
          this.tool.onMouseMove(...this.getCursorPosition(e))
        } else {
          this.onSelectMouseMove(e)
        }
        break
      case OPERATION_TYPE.DRAG:
        if (isScrolling) {
          this.onDragMouseMove(e)
        }
        break
      default:
        this.tool.onMouseMove(...this.getCursorPosition(e))
    }

  }

  onMouseOut(e) {
    const { operation } = this.props

    switch (operation) {
      case OPERATION_TYPE.DRAW_LINE:
        this.onDrawlineMouseUp(e)
        break
      case OPERATION_TYPE.DRAW_SHAPE:
        this.onDrawShapeMouseUp(e)
        break
      case OPERATION_TYPE.CLEAR:
        this.onCleanMouseUp(e)
        break
      case OPERATION_TYPE.SELECT:
        this.onSelectMouseUp(e)
        break
      case OPERATION_TYPE.DRAG:
        this.onDragMouseUp(e)
        break
      default:
        break
    }
  }

  onMouseUp(e) {
    const { operation } = this.props

    switch (operation) {
      case OPERATION_TYPE.DRAW_LINE:
        this.onDrawlineMouseUp(e)
        break
      case OPERATION_TYPE.DRAW_SHAPE:
        this.onDrawShapeMouseUp(e)
        break
      case OPERATION_TYPE.CLEAR:
        this.onCleanMouseUp(e)
        break
      case OPERATION_TYPE.SELECT:
        this.onSelectMouseUp(e)
        break
      case OPERATION_TYPE.DRAG:
        this.onDragMouseUp(e)
        break
      default:
        break
    }
  }


	/**
	* 框选和移动操作时触发的 mousedown 事件
	* 根据鼠标落点判断是否在所框选矩形中
	* 移动框选组件还是重新框选
	*/
  onSelectMouseDown(e) {
    const pos = this.getCursorPosition(e)
    const { color, size, fillColor } = this.props
    const { selectedRect } = this.state

    if (selectedRect && this.isInGraph(pos, selectedRect)) {
			// TODO绘制框选矩阵的大矩阵
      this.setState({
        isDragging: true,
        startDragPoint: pos
      })
    } else {
      this.setState({
        isDragging: false,
        startDragPoint: null,
        selectedRect: null,
        selectedItems: []
      })
      this.initTool(TOOL_RECTANGLE)
      this.tool.onMouseDown(...pos, color, size, fillColor)
    }
  }

	/**
	* 框选之后移动操作时触发的 mousemove 事件
	* 根据鼠标落点计算移动距离
	* 移动虚线框，重新计算操作数组的位置数据，重绘 canvas
	*/
  onSelectMouseMove(e) {
    const { startDragPoint, selectedItems, selectedRect } = this.state
    const pos = this.getCursorPosition(e)
    const diff = {
      x: pos[0] - startDragPoint[0],
      y: pos[1] - startDragPoint[1]
    }
    const rect = this.rect
    rect.style.display = 'block'
    rect.style.left = (selectedRect.xMin + diff.x) + 'px'
    rect.style.top = (selectedRect.yMin + diff.y) + 'px'
    rect.style.width = (selectedRect.xMax - selectedRect.xMin) + 'px'
    rect.style.height = (selectedRect.yMax - selectedRect.yMin) + 'px'

    const { items } = this.props
    const newItems = _moveItems(items, selectedItems.map((i) => i.id), diff)
    this._clear()
    this.renderItems(newItems)
  }


	/**
	* 框选和移动操作时触发的 mouseup 事件
	* 根据 isDragging 判断是框选操作还是移动操作
	* 框选操作：计算当前框中选中的操作，画出虚线框；
	* 移动操作：完成移动操作，发送同步信息
	*/
  onSelectMouseUp(e) {
    const { isDragging, startDragPoint, selectedItems } = this.state
    if (!isDragging) {
      const a = this.tool.onMouseUp(...this.getCursorPosition(e), false)
      if (a && a[0]) {
        const data = a[0]
        let rect = {
          xMin: data.start.x,
          xMax: data.end.x,
          yMin: data.start.y,
          yMax: data.end.y
        }

        let resultRect = {
          xMin: data.start.x,
          xMax: data.end.x,
          yMin: data.start.y,
          yMax: data.end.y
        }

        const { items } = this.props
        const selectedItems = []
        items.forEach((item) => {
          if (item.op !== OPERATION_TYPE.CLEAR && item.op !== OPERATION_TYPE.SELECT) {
            const position = item.data.position
            if (this.isInGraph(position.center, rect)) {
              selectedItems.push(item)
              if (position.x < resultRect.xMin ) {
                resultRect.xMin = position.x
              }

              if (position.x + position.w > resultRect.xMax) {
                resultRect.xMax = position.x + position.w
              }

              if (position.y < resultRect.yMin ) {
                resultRect.yMin = position.y
              }

              if (position.y + position.h > resultRect.yMax) {
                resultRect.yMax = position.y + position.h
              }
            }
          }
        })

				// TODO绘制框选矩形的虚线

        const rectRef = this.rect
        rectRef.style.display = 'block'
        rectRef.style.left = (resultRect.xMin) + 'px'
        rectRef.style.top = (resultRect.yMin) + 'px'
        rectRef.style.width = (resultRect.xMax - resultRect.xMin) + 'px'
        rectRef.style.height = (resultRect.yMax - resultRect.yMin) + 'px'

        this.setState({
          selectedItems,
          selectedRect: resultRect
        })
      }

    } else {

			// TODO绘制框选矩形的虚线
      const pos = this.getCursorPosition(e)
      const diff = {
        x: pos[0] - startDragPoint[0],
        y: pos[1] - startDragPoint[1]
      }
      setTimeout(() => {
        this.rect.style.display = 'none'
      }, 0)

      const { items } = this.props
      const { selectedRect } = this.state
      selectedRect.xMin = selectedRect.xMin + diff.x
      selectedRect.xMax = selectedRect.xMax + diff.x
      selectedRect.yMin = selectedRect.yMin + diff.y
      selectedRect.yMax = selectedRect.yMax + diff.y

      const ops = selectedItems.map((item) => item.id)
      const newItems = _moveItems(items, ops, diff)
      this._clear()
      this.renderItems(newItems)
      this.sendMessage(OPERATION_TYPE.MOVE, { ops, diff })

      this.setState({
        isDragging: false,
        selectedRect
      })
    }
  }


	/**
	* 画线操作 mousedown 事件
	* tool 画线
	*/
  onDrawlineMouseDown(e) {
    const { color, size, fillColor } = this.props
    
    this.tool.onMouseDown(...this.getCursorPosition(e), color, size, fillColor)
  }

	/**
	* 画线操作 mouseup 事件
	* 计算线条所占的最大矩形，同步画线操作
	*/
  onDrawlineMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e))
    if (data && data[0]) {
      let lineData = data[0]
      let pos = null
      if (lineData.tool === TOOL_PENCIL) {
        let xMax = 0, yMax = 0, xMin = lineData.points[0].x, yMin = lineData.points[0].y
        lineData.points.forEach((p) => {
          if (p.x > xMax) {
            xMax = p.x
          }
          if (p.x < xMin) {
            xMin = p.x
          }
          if (p.y > yMax) {
            yMax = p.y
          }
          if (p.y < yMin) {
            yMin = p.y
          }
        })
        pos = {
          x: xMin,
          y: yMin,
          w: xMax - xMin,
          h: yMax - yMin,
          center: [(xMin + xMax) / 2, (yMin + yMax) / 2]
        }
      } else {
        pos = {
          x: lineData.start.x,
          y: lineData.start.y,
          w: lineData.end.x - lineData.start.x,
          h: lineData.end.y - lineData.start.y,
          center: [(lineData.start.x + lineData.end.x) / 2, (lineData.start.y + lineData.end.y) / 2]
        }
      }
      this.sendMessage(OPERATION_TYPE.DRAW_LINE, lineData, pos)
    }
  }

	/**
	* 画形状操作 mouseup 事件
	* 计算形状所占的最大矩形，同步操作
	*/
  onDrawShapeMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e))
    if (data && data[0]) {
      let shape = data[0]
      const pos = {
        x: shape.start.x,
        y: shape.start.y,
        w: shape.end.x - shape.start.x,
        h: shape.end.y - shape.start.y,
        center: [(shape.end.x + shape.start.x) / 2, (shape.end.y + shape.start.y) / 2]
      }

      this.sendMessage(OPERATION_TYPE.DRAW_SHAPE, shape, pos)
    }
  }

	/**
	* 擦除操作 mousedown 事件
	* 背景色画线操作
	*/
  onCleanMouseDown(e) {
    const { size, fillColor } = this.props
    this.tool.onMouseDown(...this.getCursorPosition(e), '#ffffff', size, fillColor)
  }

  onCleanMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e))

    if (data && data[0]) {
      let lineData = data[0]
      let pos = null
      let xMax = 0, yMax = 0, xMin = lineData.points[0].x, yMin = lineData.points[0].y
      lineData.points.forEach((p) => {
        if (p.x > xMax) {
          xMax = p.x
        }
        if (p.x < xMin) {
          xMin = p.x
        }
        if (p.y > yMax) {
          yMax = p.y
        }
        if (p.y < yMin) {
          yMin = p.y
        }
      })
      pos = {
        x: xMin,
        y: yMin,
        w: xMax - xMin,
        h: yMax - yMin,
        center: [(xMin + xMax) / 2, (yMin + yMax) / 2]
      }
      this.sendMessage(OPERATION_TYPE.CLEAR, lineData, pos)
    }
  }

	/**
	* 插入文字操作 mousedown 事件
	* 在鼠标落点显示矩形
	*/
  onrenderTextArea(e) {
    const textarea = this.textarea
    const canvas = this.canvas
    const pos = this.getCursorPosition(e)
    textarea.value = ''
    textarea.style.display = 'block'
    textarea.style.left = pos[0] + canvas.offsetLeft + 'px'
    textarea.style.top = pos[1] + canvas.offsetTop + 'px'
    textarea.placeholder = 'Type here:'
    setTimeout(() => {
      textarea.focus()
    }, 0)
  }

	/**
	* textarea 的 keypress 事件
	* 回车键添加文本，隐藏 textarea
	* TODO 文本输入的换行操作和插入文字时的换行操作
	*/
  onTextAreaKeyPress(e) {
    const textarea = this.textarea
    const canvas = this.canvas
    if (e.keyCode === 13) {
      let currentPos = [textarea.offsetLeft - canvas.offsetLeft, textarea.offsetTop - canvas.offsetTop]
      e.preventDefault()
      const text = textarea.value
      this.renderText({ pos: currentPos, text, fontSize: 16 })
      textarea.style.display = 'none'
      const width = this.ctx.measureText(text).width
      const pos = {
        x: currentPos[0],
        y: currentPos[1],
        w: width,
        h: 16,
        center: [(currentPos[0] + (width / 2)), (currentPos[1] + 8)]
      }

			//文字放大

			// 广播消息
      this.sendMessage(OPERATION_TYPE.TEXT, { pos: [currentPos[0], currentPos[1]], text, fontSize: 16 }, pos)
    }
  }


	/**
	* textarea 的拖拽事件
	*
	*/
  dragTextArea(e) {
    const textarea = this.textarea

    const x = textarea.offsetLeft - e.clientX, y = textarea.offsetTop - e.clientY

    const drag = (e) => {
      textarea.style.left = e.clientX + x + 'px'
      textarea.style.top = e.clientY + y + 'px'
    }

    const stopDrag = () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', stopDrag)
    }

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', stopDrag)
  }

	/**
	* 插入图片操作的 mousedown 事件
	* 点击隐藏的 file-input
	*/
  onInsertPic(e) {
    // const pos = this.getCursorPosition(e)
    const fileInput = this.fileInput
    console.log('file click')
    
    fileInput.click()
  }

	/*
	* 图片 file-input 的 onchange 事件
	* 创建 Image 对象插入图片（缓存图片对象），同步插入操作
	*/
  onFileChange(e) {
    const file = e.target.files[0]
        
    const offsetLeft = this.sketchPad.scrollLeft
    const offsetTop = this.sketchPad.scrollTop
    if (file) {
      let reader = new window.FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        let base64data = reader.result
        this.setState({
          isUploading: true,
          uploadImage: base64data,
          offsetLeft,
          offsetTop
        })
      }
    }
  }

  handlePlaceImage(place) {
    const { uploadImage } = this.state

    const img = new Image()
    const mid = 'img_' + v4()
    img.src = uploadImage
    this._cacheImgs[mid] = img
    img.onload = () => {
      this.ctx.drawImage(img, place.left, place.top, place.width, place.height)
      let posInfo = {
        x: place.left,
        y: place.top,
        w: place.width,
        h: place.height
      }
      posInfo.center = [posInfo.x + (posInfo.w / 2), posInfo.y + (posInfo.h / 2)]
      this.sendMessage(OPERATION_TYPE.INSERT_PIC, {
        mid,
        pos: [place.left, place.top],
        info: { w: posInfo.w, h: posInfo.h },
        imgData: uploadImage
      }, posInfo)
    }

    this.fileInput.value = ''
    this.setState({
      isUploading: false,
      uploadImage: null
    })
    
  }

	/**
	* canvas 放大后的拖动视口操作 mousedown 事件
	* mousedown mousemove mouseup 模拟拖拽操作
	*/
  onDragMouseDown(e) {
    const pos = this.getCursorPosition(e)
    this.setState({
      startScrollPoint: pos,
      isScrolling: true
    })
  }

	/**
	* canvas 放大后的拖动视口操作 mousemove 事件
	* 根据拖动距离计算 canvas 和 canvasbg 的移动距离
	*/
  onDragMouseMove(e) {
    const { scale, width, height } = this.props
    const { startScrollPoint, isScrolling } = this.state

    if (!isScrolling) {
      return
    }

    const pos = this.getCursorPosition(e)
    const diff = {
      x: pos[0] - startScrollPoint[0],
      y: pos[1] - startScrollPoint[1]
    }

    const canvas = this.canvas
    const bg = this.canvasBg

    let oTop = canvas.offsetTop
    let oLeft = canvas.offsetLeft
    let resTop = oTop + diff.y
    let resLeft = oLeft + diff.x

    if (resTop > 0) {
      resTop = 0
    }

    if (resTop < -(height * (scale - 1))) {
      resTop = - (height * (scale - 1))
    }

    if (resLeft > 0) {
      resLeft = 0
    }

    if (resLeft < -(width * (scale - 1))) {
      resLeft = - (width * (scale - 1))
    }

    canvas.style.top = resTop + 'px'
    canvas.style.left = resLeft + 'px'
    bg.style.top = resTop + 'px'
    bg.style.left = resLeft + 'px'

  }

  onDragMouseUp() {
    this.setState({ isScrolling: false, startScrollPoint: null })
  }

	/**
	* 获取当前鼠标落地在 canvas 上的相对位置
	*/
  getCursorPosition(e) {
    const { top, left } = this.canvas.getBoundingClientRect()

    return [
      e.clientX - left,
      e.clientY - top
    ]
  }



	/**
	* 同步信息操作
	* op: 操作类型
	* data: 具体的操作数据
	* position: 操作的所占的最大矩形
	*/
  sendMessage(op, data, position = {}) {
    data.position = position
    const msg = {
      op,
      data
    }
		// console.log('send message', msg)
    this.props.onCompleteItem && this.props.onCompleteItem(msg)
  }

	/**
	* 绘图操作
	* items: 操作数组
	* animate: 画线方式
	*/
  renderItems(items, animate = false) {
    items.forEach((item) => {
      switch (item.op) {
        case OPERATION_TYPE.DRAW_LINE:
          this.initTool(item.data.tool)
          this.tool.draw(item.data, animate)
          break
        case OPERATION_TYPE.DRAW_SHAPE:
          this.initTool(item.data.tool)
          this.tool.draw(item.data, animate)
          break
        case OPERATION_TYPE.CLEAR:
          this.initTool(item.data.tool)
          this.tool.draw(item.data, false)
          break
        case OPERATION_TYPE.TEXT:
          this.renderText(item.data)
          break
        case OPERATION_TYPE.INSERT_PIC:
          this.renderImage(item.data)
          break
        default:
          break
      }
    })
  }

	/**
	* 渲染文字操作
	* items: 操作数组
	* animate: 画线方式
	*/
  renderText({ pos, text }) {
    this.ctx.globalCompositeOperation = 'source-over'
    this.ctx.font = '16px Droid sans'
    this.ctx.fillStyle = 'black'
		// TODO 自动换行
    this.ctx.fillText(text, pos[0], pos[1])
  }

	/**
	* 渲染图片操作
	* mid: 图片对象的 uuid
	* pos: 图片位置
	* info: 图片大小
	* imgData: 图片的 base64data
	*/
  renderImage({ mid, pos, imgData, info }) {
    let img = this._cacheImgs[mid]
    if (img) {
      img.width = info.w
      this.ctx.drawImage(img, pos[0], pos[1], info.w, info.h)
    } else {
      img = new Image()
      img.src = imgData
      this._cacheImgs[mid] = img
      img.width = info.w
      img.onload = () => {
        this.ctx.drawImage(img, pos[0], pos[1], info.w, info.h)
      }
    }
  }

	/**
	* 缩放 canvas 时重新计算 canvas 位置
	*/
  relocateCanvas(prevScale) {
    const { scale, width, height } = this.props
    const canvas = this.canvas
    const bg = this.canvasBg
    let oTop = canvas.offsetTop
    let oLeft = canvas.offsetLeft

    let heightDiff = height * (scale - prevScale)
    let topDiff = heightDiff * ((oTop - 1) / (height * (prevScale - 1) + 2))
    let widthDiff = width * (scale - prevScale)
    let leftDiff = widthDiff * ((oLeft - 1) / (width * (prevScale - 1) + 2))
    canvas.style.top = oTop + topDiff + 'px'
    canvas.style.left = oLeft + leftDiff + 'px'
    bg.style.top = oTop + topDiff + 'px'
    bg.style.left = oLeft + leftDiff + 'px'
  }

  initTool(tool) {
    this.tool = this.props.toolsMap[tool](this.ctx)
  }

	/**
	* 判断中心点是否在矩形中
	* point: 操作矩阵的中心点
	* rect: 框选的矩阵
	*/
  isInGraph(point, rect) {
    if (point[0] >= rect.xMin && point[0] <= rect.xMax) {
      if (point[1] >= rect.yMin && point[1] <= rect.yMax) {
        return true
      }
    }
    return false
  }

  handleDropImage(e) {

    e.preventDefault()
    const offsetLeft = this.sketchPad.scrollLeft
    const offsetTop = this.sketchPad.scrollTop
    var files = e.dataTransfer ? e.dataTransfer.files : [] // 文件对象
    if (files.length > 0) {
      let file = files[0]
      let type = file.type

      if (type.includes('image')) {
        let reader = new window.FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          let base64data = reader.result
          this.setState({
            isUploading: true,
            uploadImage: base64data,
            offsetLeft,
            offsetTop
          })
        }
      } else {
        message.warning('只支持图片类型文件')
      }
    }
  }

  handleDragOverImage(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  handleDragLeaveImage(e) {
    e.preventDefault()
  }

  _clear() {
    const { width, height, scale } = this.props
    this.ctx.clearRect(0, 0, width * scale, height * scale)
  }

  render() {
    const { width, height, scale } = this.props
    const { isTexting, isUploading, uploadImage, offsetLeft, offsetTop } = this.state

    return (
      <div className={classNames({
        'hidden': isUploading,
        [styles.sketchPad]: true,
      })}
      onDragOver={this.handleDragOverImage}
      onDragLeave={this.handleDragLeaveImage}
      onDrop={this.handleDropImage.bind(this)}
      ref={(pad) => { this.sketchPad = pad }}
      >
        <div ref={(b) => this.canvasBg = b} className={styles.canvasBackground} style={{ width: (width * scale) + 'px', height: (height * scale) + 'px' }}>
          <svg
            ref={(d) => this.rect = d}
            className={styles.selectedRect}
            style={{ display: 'none' }}
          >
            <rect className="rect" x="0" y="0" />
          </svg>
        </div>
        <canvas
          ref={(canvas) => { this.canvasRef = canvas }}
          className={styles.canvas}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
          onMouseOut={this.onMouseOut}
          onMouseUp={this.onMouseUp}
          
          width={width * scale}
          height={height * scale}
        />

        <textarea
          ref={(tarea) => { this.textarea = tarea }}
          className={classNames({
            [styles.textareaShow]: isTexting,
            [styles.canvasTextArea]: true,
          })}
          onBlur={() => this.textarea.style.display = 'none'}
          onMouseDown={this.dragTextArea.bind(this)}
          onKeyDown={this.onTextAreaKeyPress.bind(this)}
        />
        <input
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          ref={(input) => this.fileInput = input}
          onChange={this.onFileChange.bind(this)}
        />

        {isUploading ? 
          <ImagePlacer
            offsetLeft={offsetLeft}
            offsetTop={offsetTop}
            image={uploadImage}
            place={this.handlePlaceImage.bind(this)}
            cancel={() => this.setState({ isUploading: false })}
          /> : null  
        }
      </div>
    )
  }

}

/**
* 移动操作数组
* items: 操作数组
* ops: 待移动的操作 id 数组
* diff: 移动的方向 x,y
*/
const _moveItems = (items, ops, diff) => {
  const diffXFn = (x) => x + diff.x
  const diffYFn = (y) => y + diff.y

  const newItems = fromJS(items).map((item) => {
    if (ops.indexOf(item.get('id')) !== -1) {
      switch (item.get('op')) {
        case OPERATION_TYPE.DRAW_LINE:
          if (item.getIn(['data', 'tool']) === TOOL_PENCIL) {
            item = item.updateIn(['data', 'points'], (points) => points.map((p) => p.update('x', diffXFn).update('y', diffYFn)))
          } else {
            item = item.updateIn(['data', 'start', 'x'], diffXFn)
					.updateIn(['data', 'start', 'y'], diffYFn)
					.updateIn(['data', 'end', 'x'], diffXFn)
					.updateIn(['data', 'end', 'y'], diffYFn)
          }
          break
        case OPERATION_TYPE.DRAW_SHAPE:
          item = item.updateIn(['data', 'start', 'x'], diffXFn)
				.updateIn(['data', 'start', 'y'], diffYFn)
				.updateIn(['data', 'end', 'x'], diffXFn)
				.updateIn(['data', 'end', 'y'], diffYFn)
          break
        case OPERATION_TYPE.TEXT:
          item = item.updateIn(['data', 'pos', 0], diffXFn)
				.updateIn(['data', 'pos', 1], diffYFn)
          break
        case OPERATION_TYPE.INSERT_PIC:
          item = item.updateIn(['data', 'pos', 0], diffXFn)
				.updateIn(['data', 'pos', 1], diffYFn)
          break
        default:
          break
      }
    }
    return item
  })
  return newItems.toJS()
}

import React, {Component, } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames'
import { Pencil, TOOL_PENCIL, Line, TOOL_LINE, Ellipse, TOOL_ELLIPSE, Rectangle, TOOL_RECTANGLE } from '../tools'
import { REMOTE_OPERATION, OPERATION_TYPE } from './ConstantUtil'
import styles from './SketchPad.scss'
import { fromJS } from 'immutable'

export const toolsMap = {
  [TOOL_PENCIL]: Pencil,
  [TOOL_LINE]: Line,
  [TOOL_RECTANGLE]: Rectangle,
  [TOOL_ELLIPSE]: Ellipse
}

export default class SketchPad extends Component {

  tool = null
  interval = null

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

  state = {
    isTexting: false,
  }

  constructor(props) {
    super(props)
    this.initTool = this.initTool.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
    // this.onDebouncedMove = this.onDebouncedMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef)
    this.ctx = this.canvas.getContext('2d')

    this.initTool(this.props.tool)
  }

  componentWillReceiveProps({tool, items, remoteType, scale}) {
    switch (remoteType) {
      case REMOTE_OPERATION.INCREMENT:
        const newItems = items.filter(item => this.props.items.indexOf(item) === -1)
        this.drawItems(newItems, true)
        break
      case REMOTE_OPERATION.DECREMENT:
        this._clear()
        this.drawItems(items)
        break
      default:
        break
    }
    this.initTool(tool)
  }

  // componentDidUpdate({scale, items}) {
  //   if (scale !== this.props.scale) {
  //     this._clear()
  //     this.drawItems(items)
  //   }
  // }

  initTool(tool) {
    this.tool = this.props.toolsMap[tool](this.ctx)
  }



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
        this.onAddTextArea(e)
        break
      case OPERATION_TYPE.INSERT_PIC:
        this.onInsertPic(e)
        break
      case OPERATION_TYPE.SELECT:
        this.onSelectMouseDown(e)
        break
      default:
        break
    }

  }

  onMouseMove(e) {
    const { isDragging } = this.state
    if (!isDragging) {
      const data = this.tool.onMouseMove(...this.getCursorPosition(e))
      data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);
    } else {
      this.onSelectMouseMove(e)
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
      default:
        break
    }
  }

  getCursorPosition(e) {
    const {top, left} = this.canvas.getBoundingClientRect()

    return [
      e.clientX - left,
      e.clientY - top
    ]
  }



  // format message, send message
  sendMessage(op, data, pos = {}) {
    const msg = {
      op,
      data,
      pos
    }
    console.log('send message', msg)
    this.props.onCompleteItem && this.props.onCompleteItem(msg)
  }





  // 不同操作的响应事件
  onSelectMouseDown(e) {
    const pos = this.getCursorPosition(e)
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
      this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size, this.props.fillColor)
    }
  }

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
    const newItems = fromJS(items).toJS().map(item => {
      if (selectedItems.find(s => s.id === item.id)) {
        switch (item.op) {
          case OPERATION_TYPE.DRAW_LINE:
            if (item.data.tool === TOOL_PENCIL) {
              item.data.points = item.data.points.map(point => {
                point.x = point.x + diff.x
                point.y = point.y + diff.y
                return point
              })
            } else {
              item.data.start.x = item.data.start.x + diff.x
              item.data.start.y = item.data.start.y + diff.y
              item.data.end.x = item.data.end.x + diff.x
              item.data.end.y = item.data.end.y + diff.y
            }
            break
          case OPERATION_TYPE.DRAW_SHAPE:
            item.data.start.x = item.data.start.x + diff.x
            item.data.start.y = item.data.start.y + diff.y
            item.data.end.x = item.data.end.x + diff.x
            item.data.end.y = item.data.end.y + diff.y
            break
          case OPERATION_TYPE.TEXT:
            let textPos = item.data.pos
            textPos[0] = textPos[0] + diff.x
            textPos[1] = textPos[1] + diff.y
            item.data.pos = textPos
            break
          case OPERATION_TYPE.INSERT_PIC:
            let pos = item.data.pos
            pos[0] = pos[0] + diff.x
            pos[1] = pos[1] + diff.y
            item.data.pos = pos
            break
          default:
            break
        }
      }
      return item
    })
    this._clear()
    this.drawItems(newItems)
  }

  onSelectMouseUp(e) {
    const { isDragging, startDragPoint, selectedItems } = this.state
    if (!isDragging) {
      const data = this.tool.onMouseUp(...this.getCursorPosition(e), false)[0]
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
      items.forEach(item => {
        if (item.op !== OPERATION_TYPE.CLEAR && item.op !== OPERATION_TYPE.SELECT) {
          const center = item.pos.center
          if (this.isInGraph(center, rect)) {
            selectedItems.push(item)
            if (item.pos.x < resultRect.xMin ) {
              resultRect.xMin = item.pos.x
            }

            if (item.pos.x + item.pos.w > resultRect.xMax) {
              resultRect.xMax = item.pos.x + item.pos.w
            }

            if (item.pos.y < resultRect.yMin ) {
              resultRect.yMin = item.pos.y
            }

            if (item.pos.y + item.pos.h > resultRect.yMax) {
              resultRect.yMax = item.pos.y + item.pos.h
            }
          }
        }
      })
      // TODO绘制框选矩形的虚线
      this.setState({
        selectedItems,
        selectedRect: resultRect
      })

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

      const newItems = fromJS(items).toJS().map(item => {
        if (selectedItems.find(s => s.id === item.id)) {
          switch (item.op) {
            case OPERATION_TYPE.DRAW_LINE:
              if (item.data.tool === TOOL_PENCIL) {
                item.data.points = item.data.points.map(point => {
                  point.x = point.x + diff.x
                  point.y = point.y + diff.y
                  return point
                })
              } else {
                item.data.start.x = item.data.start.x + diff.x
                item.data.start.y = item.data.start.y + diff.y
                item.data.end.x = item.data.end.x + diff.x
                item.data.end.y = item.data.end.y + diff.y
              }
              break
            case OPERATION_TYPE.DRAW_SHAPE:
              item.data.start.x = item.data.start.x + diff.x
              item.data.start.y = item.data.start.y + diff.y
              item.data.end.x = item.data.end.x + diff.x
              item.data.end.y = item.data.end.y + diff.y
              break
            case OPERATION_TYPE.TEXT:
              let textPos = item.data.pos
              textPos[0] = textPos[0] + diff.x
              textPos[1] = textPos[1] + diff.y
              item.data.pos = textPos
              break
            case OPERATION_TYPE.INSERT_PIC:
              let pos = item.data.pos
              pos[0] = pos[0] + diff.x
              pos[1] = pos[1] + diff.y
              item.data.pos = pos
              break
            default:
              break
          }
        }
        return item
      })
      this._clear()
      this.drawItems(newItems)
      const ops = selectedItems.map(item => item.id)
      this.sendMessage(OPERATION_TYPE.MOVE, { ops, diff })

      this.setState({
        isDragging: false,
        selectedRect
      })
    }

  }

  onDrawlineMouseDown(e) {
    const data = this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size, this.props.fillColor)

    data && data[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data)
  }

  onDrawlineMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    if (data && data[0]) {
      let lineData = data[0]
      if (lineData.tool === TOOL_PENCIL) {
        let xMax = 0, yMax = 0, xMin = lineData.points[0].x, yMin = lineData.points[0].y
        lineData.points.forEach(p => {
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
        const pos = {
          x: xMin,
          y: yMin,
          w: xMax - xMin,
          h: yMax - yMin,
          center: [ (xMin + xMax) / 2, (yMin + yMax) / 2 ]
        }
        this.sendMessage(OPERATION_TYPE.DRAW_LINE, data[0], pos)
      } else {
        const pos = {
          x: lineData.start.x,
          y: lineData.start.y,
          w: lineData.end.x - lineData.start.x,
          h: lineData.end.y - lineData.start.y,
          center: [(lineData.start.x + lineData.end.x) / 2, (lineData.start.y + lineData.end.y) / 2]
        }
        this.sendMessage(OPERATION_TYPE.DRAW_LINE, lineData, pos)
      }


    }
  }

  onDrawShapeMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    if (data && data[0]) {
      let shape = data[0]
      const pos = {
        x: shape.start.x,
        y: shape.start.y,
        w: shape.end.x - shape.start.x,
        h: shape.end.y - shape.start.y,
        center: [ (shape.end.x + shape.start.x) / 2, (shape.end.y + shape.start.y) / 2 ]
      }
      this.sendMessage(OPERATION_TYPE.DRAW_SHAPE, data[0], pos)
    }
  }

  onCleanMouseDown(e) {
    const cleanData = this.tool.onMouseDown(...this.getCursorPosition(e), '#ffffff', this.props.size, this.props.fillColor)

    cleanData && cleanData[0] && this.props.onItemStart && this.props.onItemStart.apply(null, cleanData)
    if (this.props.onDebouncedItemChange) {
      this.interval = window.setInterval(this.onDebouncedMove, this.props.debounceTime)
    }
  }

  onCleanMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    data && data[0] && this.sendMessage(OPERATION_TYPE.CLEAR, data[0])
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  onAddTextArea(e) {
    const textarea = this.textarea
    const pos = this.getCursorPosition(e)
    textarea.value = ''
    textarea.style.display = 'block'
    textarea.style.left = pos[0] + 'px'
    textarea.style.top = pos[1] + 'px'
    textarea.placeholder = "Type here:"
    setTimeout(() => {
      textarea.focus()
    }, 0)
  }

  onTextAreaKeyPress(e) {
    const textarea = this.textarea
    if (e.keyCode === 13) {
      let currentPos = [textarea.offsetLeft, textarea.offsetTop]
      e.preventDefault()
      const text = textarea.value
      this.addText({pos: currentPos, text})
      textarea.style.display = 'none'
      const width = this.ctx.measureText(text).width
      const pos = {
        x: currentPos[0],
        y: currentPos[1],
        w: width,
        h: 16,
        center: [currentPos[0] + (width / 2), currentPos[1] + 8 ]
      }
      // 广播消息
      this.sendMessage(OPERATION_TYPE.TEXT, { pos: currentPos, text }, pos)
    }
  }

  dragTextArea(e) {
    const textarea = this.textarea

    const x = textarea.offsetLeft - e.clientX, y = textarea.offsetTop - e.clientY

    const drag = (e) => {
      textarea.style.left = e.clientX + x + 'px';
      textarea.style.top = e.clientY + y + 'px';
    }

    const stopDrag = () => {
      document.removeEventListener('mousemove', drag)
      document.removeEventListener('mouseup', stopDrag)
    }

    document.addEventListener('mousemove', drag)
    document.addEventListener('mouseup', stopDrag)
  }


  onInsertPic(e) {
    const pos = this.getCursorPosition(e)
    const fileInput = this.fileInput
    fileInput.pos = pos
    fileInput.click()
  }

  onFileChange(e) {
    const file = e.target.files[0]
    if (file) {
      const pos = this.fileInput.pos

      let reader = new window.FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        let base64data = reader.result
        const img = document.createElement("img")
        img.src = base64data
        img.onload = (e) => {
          this.ctx.drawImage(img, pos[0], pos[1])
          let posInfo = {
            x: pos[0],
            y: pos[1],
            w: img.width,
            h: img.height
          }
          posInfo.center = [posInfo.x + (posInfo.w / 2), posInfo.y + (posInfo.h / 2)]
          this.sendMessage(OPERATION_TYPE.INSERT_PIC, { pos, imgData: base64data }, posInfo)
        }

      }
    }

  }



  // 内部函数

  // 绘图操作
  drawItems(items, animate = false) {
    items.forEach(item => {
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
          this.addText(item.data)
          break
        case OPERATION_TYPE.INSERT_PIC:
          this.drawPic(item.data)
          break
        default:
          break
      }
    })
  }

  addText({pos, text}) {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.font = '16px Droid sans';
    this.ctx.fillStyle = 'black';
    // TODO 自动换行
    this.ctx.fillText(text, pos[0], pos[1]);
  }

  drawPic({ pos, imgData }) {
    const img = document.createElement("img")
    img.src = imgData
    img.onload = (e) => {
      this.ctx.drawImage(img, pos[0], pos[1])
    }
  }

  isInGraph(point, rect) {
    if (point[0] >= rect.xMin && point[0] <= rect.xMax) {
      if (point[1] >= rect.yMin && point[1] <= rect.yMax) {
        return true
      }
    }
    return false
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height)
  }

  render() {
    const { width, height, scale } = this.props
    const { isTexting } = this.state
    return (
        <div className={styles.sketchPad}>
            <div className={styles.canvasBackground} style={{ width: width * (scale / 100) + 'px', height: height * (scale / 100) + 'px' }}>
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
                width={width * (scale / 100)}
                height={height * (scale / 100)}
                style={{ cursor: 'crosshair' }}
            />

            <textarea
              ref={(tarea) => { this.textarea = tarea } }
              className={classNames({
                [styles.textareaShow]: isTexting,
                [styles.canvasTextArea]: true,
              })}
              onBlur={() => this.textarea.style.display = 'none'}
              onMouseDown={this.dragTextArea.bind(this)}
              onKeyDown={this.onTextAreaKeyPress.bind(this)}
            ></textarea>
            <input
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              ref={(input) => this.fileInput = input }
              onChange={this.onFileChange.bind(this)}
            />


        </div>
    )
  }
}

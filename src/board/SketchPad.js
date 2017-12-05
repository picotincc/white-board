import React, {Component, } from 'react'
import { v4 } from 'uuid'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import classNames from 'classnames'
import { Pencil, TOOL_PENCIL, Line, TOOL_LINE, Ellipse, TOOL_ELLIPSE, Rectangle, TOOL_RECTANGLE } from '../tools'
import { REMOTE_OPERATION, OPERATION_TYPE } from './ConstantUtil'
import styles from './SketchPad.scss'

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
    isTexting: false
  }

  constructor(props) {
    super(props)
    this.initTool = this.initTool.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onDebouncedMove = this.onDebouncedMove.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
  }

  componentDidMount() {
    this.canvas = findDOMNode(this.canvasRef)
    this.ctx = this.canvas.getContext('2d')

    this.initTool(this.props.tool)
  }

  componentWillReceiveProps({tool, items, remoteType}) {
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
      case OPERATION_TYPE.CLEAR:
        this.onCleanMouseDown(e)
        break
      case OPERATION_TYPE.TEXT:
        this.onAddTextArea(e)
        break
      case OPERATION_TYPE.INSERT_PIC:
        this.onInsertPic(e)
        break
      default:
        break
    }

  }

  onDebouncedMove() {

    if (typeof this.tool.onDebouncedMouseMove === 'function' && this.props.onDebouncedItemChange) {
      this.props.onDebouncedItemChange.apply(null, this.tool.onDebouncedMouseMove())
    }
  }

  onMouseMove(e) {

    const data = this.tool.onMouseMove(...this.getCursorPosition(e));
    data && data[0] && this.props.onEveryItemChange && this.props.onEveryItemChange.apply(null, data);
  }

  onMouseUp(e) {
    const { operation } = this.props

    switch (operation) {
      case OPERATION_TYPE.DRAW_LINE:
        this.onDrawlineMouseUp(e)
        break
      case OPERATION_TYPE.CLEAR:
        this.onCleanMouseUp(e)
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
  sendMessage(op, data) {
    const msg = {
      op,
      data
    }
    this.props.onCompleteItem && this.props.onCompleteItem(msg)
  }





  // 不同操作的响应事件
  onDrawlineMouseDown(e) {
    const data = this.tool.onMouseDown(...this.getCursorPosition(e), this.props.color, this.props.size, this.props.fillColor)

    data && data[0] && this.props.onItemStart && this.props.onItemStart.apply(null, data)
    if (this.props.onDebouncedItemChange) {
      this.interval = window.setInterval(this.onDebouncedMove, this.props.debounceTime)
    }
  }

  onDrawlineMouseUp(e) {
    const data = this.tool.onMouseUp(...this.getCursorPosition(e));
    data && data[0] && this.sendMessage(OPERATION_TYPE.DRAW_LINE, data[0])
    if (this.props.onDebouncedItemChange) {
      clearInterval(this.interval);
      this.interval = null;
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

      // 广播消息
      this.sendMessage(OPERATION_TYPE.TEXT, { pos: currentPos, text })
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
    console.log(this.props.operation)
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
        console.log(base64data)
        this.drawPic({ pos, imgData: base64data })

        this.sendMessage(OPERATION_TYPE.INSERT_PIC, { pos, imgData: base64data })
      }
    }

  }












  // 内部函数

  // 绘图操作
  drawItems(items, animate = false) {
    console.log(items)
    items.forEach(item => {
      switch (item.op) {
        case OPERATION_TYPE.DRAW_LINE:
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
    this.ctx.fillText(text, pos[0], pos[1]);
  }

  drawPic({ pos, imgData }) {
    const img = document.createElement("img")
    img.src = imgData
    img.onload = (e) => {
      this.ctx.drawImage(img, pos[0], pos[1])
    }
  }

  _clear() {
    this.ctx.clearRect(0, 0, this.props.width, this.props.height)
  }

  render() {
    const { width, height, canvasClassName } = this.props
    const { isTexting } = this.state
    return (
        <div className={styles.sketchPad}>
            <canvas
                ref={(canvas) => { this.canvasRef = canvas }}
                className={canvasClassName}
                onMouseDown={this.onMouseDown}
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseUp}
                onMouseUp={this.onMouseUp}
                width={width}
                height={height}
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

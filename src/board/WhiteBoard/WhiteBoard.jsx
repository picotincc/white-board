import React from 'react'
import { Dropdown, Menu, Slider, Popconfirm } from 'antd'

import { TOOL_LINE, TOOL_PENCIL, TOOL_RECTANGLE, TOOL_ELLIPSE } from '../tools'
import { fromJS } from 'immutable'
import styles from './WhiteBoard.scss'
import SketchPad from '../SketchPad'
import EditorBtn from '../EditorBtn'
import { PenIcon, RubberIcon, ClearIcon, AuthIcon, StrokeIcon } from '../svg'
import { OPERATION_TYPE } from '../ConstantUtil'

const colorsMenu = [
  { name: 'black', color: '#4a4a4a' },
  { name: 'red', color: '#f55b6c' },
  { name: 'yellow', color: '#f7c924' },
  { name: 'green', color: '#63d321' },
  { name: 'blue', color: '#50e3c2' },
  { name: 'cyan', color: '#59b9ff' },
  { name: 'purple', color: '#bd10e0' },
  { name: 'white', color: '#ffffff' },
]

class WhiteBoard extends React.Component {

  state = {
    color: 'blue',
    colorVisible: false,
    scale: 1,
    operation: OPERATION_TYPE.DRAW_LINE,
    tool: TOOL_PENCIL,
    lineType: 'stroke',
    size: 5
  }

  componentDidMount() {

  }

  handleSendMessage(item) {
    const { scale } = this.state
    const msg = this.restoreItem(item, scale)
    this.props.sendMessage(msg)
  }

  handleUploadImage() {
    this.sketchPad.onInsertPic()
  }

  handleSaveCanvasToImage() {
    const canvas = this.sketchPad.canvas
    const img = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = img
    a.download = 'download-whiteboard.png'
    a.click()
  }

  handleUndo() {
    console.log('undo')
    this.props.undo({ op: OPERATION_TYPE.UNDO })
  }

  handleRedo() {
    console.log('redo')
    this.props.redo({ op: OPERATION_TYPE.REDO })
  }

  handleCleanAll() {
    console.log('clean all')
    this.props.sendMessage({ op: OPERATION_TYPE.CLEAR_ALL })
  }

  // 根据 scale 放大操作数据
  scaleItems(items) {
    const { scale } = this.state
    const newItems = items.map((item) => {
      return this.restoreItem(item, scale, true)
    })
    return newItems
  }

  // 根据 scale 放大或缩小操作数据
  restoreItem(data, scale, isEnlarge = false) {
    const enlarge = (x) => x * scale
    const reduce = (x) => x / scale
    const scaleFn = isEnlarge ? enlarge : reduce
    let item = fromJS(data)

    switch (item.get('op')) {
      case OPERATION_TYPE.DRAW_LINE:

        if (item.getIn(['data', 'tool']) === TOOL_PENCIL) {
          item = item.updateIn(['data', 'points'], (points) => points.map((p) => {
            p = p.update('x', scaleFn)
            .update('y', scaleFn)
            return p
          })).updateIn(['data', 'size'], scaleFn)
        } else {
          item = item.updateIn(['data', 'start', 'x'], scaleFn)
          .updateIn(['data', 'start', 'y'], scaleFn)
          .updateIn(['data', 'end', 'x'], scaleFn)
          .updateIn(['data', 'end', 'y'], scaleFn)
          .updateIn(['data', 'size'], scaleFn)
        }
        break
      case OPERATION_TYPE.CLEAR:
        item = item.updateIn(['data', 'points'], (points) => points.map((p) => {
          p = p.update('x', scaleFn)
          .update('y', scaleFn)
          return p
        })).updateIn(['data', 'size'], scaleFn)
        break
      case OPERATION_TYPE.DRAW_SHAPE:
        item = item.updateIn(['data', 'start', 'x'], scaleFn)
        .updateIn(['data', 'start', 'y'], scaleFn)
        .updateIn(['data', 'end', 'x'], scaleFn)
        .updateIn(['data', 'end', 'y'], scaleFn)
        .updateIn(['data', 'size'], scaleFn)
        break
      case OPERATION_TYPE.TEXT:
        item = item.updateIn(['data', 'pos'], (pos) => pos.map(scaleFn))
        break
      case OPERATION_TYPE.INSERT_PIC:
        item = item.updateIn(['data', 'pos'], (pos) => pos.map(scaleFn))
                  .updateIn(['data', 'info'], (info) => info.map(scaleFn))
        break
      case OPERATION_TYPE.MOVE:
        item = item.updateIn(['data', 'diff'], (pos) => pos.map(scaleFn))
        break
      default:
        break
    }

    if (item.get('op') !== OPERATION_TYPE.MOVE) {
      item = item.updateIn(['data', 'position', 'x'], scaleFn)
      .updateIn(['data', 'position', 'y'], scaleFn)
      .updateIn(['data', 'position', 'w'], scaleFn)
      .updateIn(['data', 'position', 'h'], scaleFn)
      .updateIn(['data', 'position', 'center'], (center) => center.map(scaleFn))
    }

    return item.toJS()
  }

  renderStrokeMenu() {
    return (
      <Menu className={styles.customMenu}>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_LINE, tool: TOOL_PENCIL, lineType: 'stroke', size: 5 })}>
            <span className={styles.itemIcon}><StrokeIcon /></span>
            <span className={styles.itemText}>画笔</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_LINE, tool: TOOL_PENCIL, lineType: 'pen', size: 2 })}>
            <span className={styles.itemIcon}><PenIcon /></span>
            <span className={styles.itemText}>钢笔</span>
          </div>
        </Menu.Item>

        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_LINE, tool: TOOL_LINE, lineType: 'straight', size: 2 })}>
            <span className={styles.itemIcon}><div className={styles.straightLine} /></span>
            <span className={styles.itemText}>直线</span>
          </div>
        </Menu.Item>
      </Menu>
    )
  }

  renderShapeMenu() {
    return (
      <Menu className={styles.customMenu}>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_SHAPE, tool: TOOL_RECTANGLE, shapeType: 'rect', size: 1 })}>
            <span className={styles.itemIcon}><div className={styles.rect}/></span>
            <span className={styles.itemText}>矩形</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_SHAPE, tool: TOOL_ELLIPSE, shapeType: 'ellipse', size: 1 })}>
            <span className={styles.itemIcon}><div className={styles.ellipse} /></span>
            <span className={styles.itemText}>圆形</span>
          </div>
        </Menu.Item>
      </Menu>
    )
  }

  renderClearMenu() {
    return (
      <Menu className={styles.customMenu}>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.CLEAR, tool: TOOL_PENCIL, size: 10 })}>
            <span className={styles.itemIcon}><RubberIcon /></span>
            <span className={styles.itemText}>擦改</span>
          </div>
        </Menu.Item>

        <Menu.Item>
          <div className={styles.menuItem}>
            <Popconfirm placement="bottom" title="确认将目前白板画面清空" onConfirm={() => this.handleCleanAll()} okText="是" cancelText="否">
              <span className={styles.itemIcon}><ClearIcon width={18} /></span>
              <span className={styles.itemText} style={{ position: 'relative', top: '-4px' }}>清空</span>
            </Popconfirm>
          </div>
        </Menu.Item>
      </Menu>
    )
  }

  renderColorMenu() {
    const { color } = this.state
    return (
      <div className={styles.colorMenu}>
        <ol className={styles.colorOl}>
          {colorsMenu.map((c, i) => {
            return (
              <li
                key={i}
                className={styles.colorLi}
                style={{ backgroundColor: c.color }}
                onClick={() => this.setState({ color: c.name, colorVisible: true, })}
              >
                {color === c.name ? <AuthIcon fill={c.color === '#ffffff' ? '#979797' : '#ffffff'}/> : null}
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  renderScaleMenu() {
    const { scale } = this.state

    return (
      <div className={styles.scaleMenu}>
        <div className={styles.text}>100%</div>
        <div className={styles.sliderContainer}>
          <Slider
            min={100}
            max={200}
            onChange={(v) => {
              this.setState({ scale: (v / 100).toFixed(2) })
            }}
            value={scale * 100}
            tipFormatter={(tip) => tip + '%'}
          />
        </div>
        <div className={styles.text}>200%</div>
      </div>
    )
  }

  render() {
    const { items, remoteType, containerWidth, containerHeight } = this.props
    const {
      color,
      colorVisible,
      operation,
      tool,
      lineType,
      size,
      scale,
    } = this.state
    
    
    return (
      <div className={styles.whiteBoard}>
        <div className={styles.editorBar}>
          <div className={styles.left}>
            <EditorBtn type="select" text="选择" selected={operation === OPERATION_TYPE.SELECT} onClick={() => this.setState({ operation: OPERATION_TYPE.SELECT })} />

            <Dropdown overlay={this.renderStrokeMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type={lineType} text="笔触" arrow selected={operation === OPERATION_TYPE.DRAW_LINE}/></div>
            </Dropdown>

            <Dropdown overlay={this.renderShapeMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="shape" text="形状" arrow selected={operation === OPERATION_TYPE.DRAW_SHAPE} /></div>
            </Dropdown>

            <Dropdown
              overlay={this.renderColorMenu()}
              placement="bottomCenter"
              trigger={['hover']}
              visible={colorVisible}
              onVisibleChange={(flag) => this.setState({ colorVisible: flag })}
            >
              <div><EditorBtn type="color" text="颜色" arrow color={colorsMenu.find((c) => c.name === color).color}/></div>
            </Dropdown>


            <EditorBtn type="text" text="文本" selected={operation === OPERATION_TYPE.TEXT} onClick={() => this.setState({ operation: OPERATION_TYPE.TEXT })} />

            <Dropdown overlay={this.renderClearMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="rubber" text="清除" arrow selected={operation === OPERATION_TYPE.CLEAR} /></div>
            </Dropdown>

            <EditorBtn type="import" text="插入" selected={operation === OPERATION_TYPE.INSERT_PIC} onClick={this.handleUploadImage.bind(this)} />
          </div>
          <div className={styles.middle}>
            <EditorBtn type="undo" text="撤销" onClick={this.handleUndo.bind(this)}/>
            <EditorBtn type="redo" text="重做" onClick={this.handleRedo.bind(this)}/>

            <Dropdown overlay={this.renderScaleMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="amp" text={(scale * 100).toFixed(0) + '%'} arrow /></div>
            </Dropdown>

            {/* <EditorBtn type="eye" text="查看" selected={operation === OPERATION_TYPE.DRAG} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAG })} /> */}

            <EditorBtn type="save" text="保存" onClick={this.handleSaveCanvasToImage.bind(this)}/>
          </div>

          <div className={styles.right}>
          </div>

        </div>
        <div className={styles.sketchPad}>
          <SketchPad
            ref={(sketchPad) => this.sketchPad = sketchPad}
            items={this.scaleItems(items)}
            width={containerWidth}
            height={containerHeight - 54}
            tool={tool}
            size={size}
            scale={scale}
            remoteType={remoteType}
            color={colorsMenu.find((c) => c.name === color).color}
            operation={operation}
            canvasClassName="user-paper"
            onCompleteItem={this.handleSendMessage.bind(this)}
          />
        </div>
        
      </div>
    )
  }
}

export default WhiteBoard

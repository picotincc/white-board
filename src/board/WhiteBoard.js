import React from 'react'
import { Dropdown, Menu, Slider } from 'antd'

import { TOOL_LINE, TOOL_PENCIL, TOOL_RECTANGLE, TOOL_ELLIPSE } from '../tools'
import { fromJS } from 'immutable'
import styles from './whiteboard.scss'
import SketchPad from './SketchPad'
import EditorBtn from './components/EditorBtn/EditorBtn'
import { PenIcon, RubberIcon, ClearIcon, AuthenticatedIcon, StrokeIcon } from './svg'
import { OPERATION_TYPE } from './ConstantUtil'

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
    size: 3
  }

  componentDidMount() {

  }

  handleSaveCanvasToImage() {
    const canvas = this.sketchPad.canvas
    const img = canvas.toDataURL("image/png")
    const a = document.createElement('a')
    a.href = img
    a.download = 'download-whiteboard.png'
    a.click()
  }

  handleUndo() {
    console.log('undo')
    this.props.undo({ op: OPERATION_TYPE.UNDO })
  }

  scaleItems(items) {
    const { scale } = this.state
    const newItems = fromJS(items).map(item => {
      switch (item.get('op')) {
        case OPERATION_TYPE.DRAW_LINE:

          if (item.getIn(['data', 'tool']) === TOOL_PENCIL) {
            item = item.updateIn(['data', 'points'], points => points.map(p => {
              p = p.update('x', x => x * scale)
                    .update('y', y => y * scale)
              return p
            })).updateIn(['data', 'size'], size => size * scale)
          } else {
            item = item.updateIn(['data', 'start', 'x'], x => x * scale)
                      .updateIn(['data', 'start', 'y'], y => y * scale)
                      .updateIn(['data', 'end', 'x'], x => x * scale)
                      .updateIn(['data', 'end', 'y'], y => y * scale)
                      .updateIn(['data', 'size'], size => size * scale)
          }
          break
        case OPERATION_TYPE.DRAW_SHAPE:
          item = item.updateIn(['data', 'start', 'x'], x => x * scale)
                    .updateIn(['data', 'start', 'y'], y => y * scale)
                    .updateIn(['data', 'end', 'x'], x => x * scale)
                    .updateIn(['data', 'end', 'y'], y => y * scale)
                    .updateIn(['data', 'size'], size => size * scale)
          break
        case OPERATION_TYPE.TEXT:
          item = item.updateIn(['data', 'pos'], pos => pos.map(p => p * scale))
          break
        case OPERATION_TYPE.INSERT_PIC:
          item = item.updateIn(['data', 'pos'], pos => pos.map(p => p * scale))
          break
        default:
          break
      }

      item = item.updateIn(['pos', 'x'], x => x * scale)
                .updateIn(['pos', 'y'], y => y * scale)
                .updateIn(['pos', 'w'], w => w * scale)
                .updateIn(['pos', 'h'], h => h * scale)
                .updateIn(['pos', 'center'], center => center.map(c => c * scale))

      return item
    })

    return newItems.toJS()

  }

  renderStrokeMenu() {
    return (
      <Menu className={styles.customMenu}>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_LINE, tool: TOOL_PENCIL, lineType: 'stroke', size: 3 })}>
            <span className={styles.itemIcon}><StrokeIcon /></span>
            <span className={styles.itemText}>画笔</span>
          </div>
        </Menu.Item>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_LINE, tool: TOOL_PENCIL, lineType: 'pen', size: 1 })}>
            <span className={styles.itemIcon}><PenIcon /></span>
            <span className={styles.itemText}>钢笔</span>
          </div>
        </Menu.Item>

        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAW_LINE, tool: TOOL_LINE, lineType: 'straight', size: 1 })}>
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
          <div className={styles.menuItem} onClick={() => this.props.onCleanAll()}>
            <span className={styles.itemIcon}><ClearIcon /></span>
            <span className={styles.itemText}>清空</span>
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
          {colorsMenu.map((c, i)=> {
            return (
              <li
                key={i}
                className={styles.colorLi}
                style={{backgroundColor: c.color}}
                onClick={() => this.setState({ color: c.name, colorVisible: true, operation: OPERATION_TYPE.DRAW_LINE })}
              >
                {color === c.name ? <AuthenticatedIcon fill={c.color === '#ffffff' ? '#979797' : '#ffffff'}/> : null}
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
            tipFormatter={tip => tip + '%'}
          />
        </div>
        <div className={styles.text}>200%</div>
      </div>
    )
  }

  render() {
    const { items, onCompleteItem, remoteType } = this.props
    const {
      color,
      colorVisible,
      operation,
      tool,
      lineType,
      size,
      scale
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
              <div><EditorBtn type="color" text="颜色" arrow color={colorsMenu.find(c => c.name === color).color}/></div>
            </Dropdown>


            <EditorBtn type="text" text="文本" selected={operation === OPERATION_TYPE.TEXT} onClick={() => this.setState({ operation: OPERATION_TYPE.TEXT })} />

            <Dropdown overlay={this.renderClearMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="rubber" text="清除" arrow selected={operation === OPERATION_TYPE.CLEAR} /></div>
            </Dropdown>

            <EditorBtn type="import" text="插入" selected={operation === OPERATION_TYPE.INSERT_PIC} onClick={() => this.setState({ operation: OPERATION_TYPE.INSERT_PIC })} />
          </div>
          <div className={styles.middle}>
            <EditorBtn type="undo" text="撤销" onClick={this.handleUndo.bind(this)}/>
            <EditorBtn type="redo" text="重做" />

            <Dropdown overlay={this.renderScaleMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="amp" text={(scale * 100).toFixed(0) + '%'} arrow /></div>
            </Dropdown>

            <EditorBtn type="amp" text="抓取" selected={operation === OPERATION_TYPE.DRAG} onClick={() => this.setState({ operation: OPERATION_TYPE.DRAG })} />

            <EditorBtn type="save" text="保存" onClick={this.handleSaveCanvasToImage.bind(this)}/>
          </div>
          <div className={styles.right}>
            <EditorBtn type="locked" text="已锁" />
          </div>

        </div>
        <SketchPad
          ref={(sketchPad) => this.sketchPad = sketchPad}
          items={this.scaleItems(items)}
          width={986}
          height={562}
          tool={tool}
          size={size}
          scale={scale}
          remoteType={remoteType}
          color={colorsMenu.find(c => c.name === color).color}
          operation={operation}
          canvasClassName="user-paper"
          onCompleteItem={onCompleteItem}
        />
      </div>
    )
  }
}

export default WhiteBoard

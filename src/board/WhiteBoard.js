import React from 'react'
import { Dropdown, Menu, Slider } from 'antd'

import styles from './whiteboard.scss'
import SketchPad from './SketchPad'
import EditorBtn from './components/EditorBtn/EditorBtn'
import { PenIcon, RubberIcon, ClearIcon, AuthenticatedIcon } from './svg'
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
    scale: 100,
    isCleanAll: true,
    operation: OPERATION_TYPE.DRAW_LINE,
  }

  componentDidMount() {

  }

  handleUndo() {
    console.log('undo')
    this.props.undo({ op: OPERATION_TYPE.UNDO })
  }

  renderStrokeMenu() {
    return (
      <Menu className={styles.customMenu}>
        <Menu.Item>
          <div className={styles.menuItem}>
            <span className={styles.itemIcon}><PenIcon /></span>
            <span className={styles.itemText}>钢笔</span>
          </div>
        </Menu.Item>

        <Menu.Item>
          <div className={styles.menuItem}>
            <span className={styles.itemIcon}><PenIcon /></span>
            <span className={styles.itemText}>钢笔</span>
          </div>
        </Menu.Item>
      </Menu>
    )
  }

  renderClearMenu() {
    return (
      <Menu className={styles.customMenu}>
        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ operation: OPERATION_TYPE.CLEAR })}>
            <span className={styles.itemIcon}><RubberIcon /></span>
            <span className={styles.itemText}>擦改</span>
          </div>
        </Menu.Item>

        <Menu.Item>
          <div className={styles.menuItem} onClick={() => this.setState({ isCleanAll: true })}>
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
            onChange={(v) => this.setState({ scale: v })}
            value={scale}
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
      operation
    } = this.state

    return (
      <div className={styles.whiteBoard}>
        <div className={styles.editorBar}>
          <div className={styles.left}>
            <EditorBtn type="select" text="选择" />

            <Dropdown overlay={this.renderStrokeMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="stroke" text="笔触" arrow /></div>
            </Dropdown>

            <EditorBtn type="shape" text="形状" arrow />

            <Dropdown
              overlay={this.renderColorMenu()}
              placement="bottomCenter"
              trigger={['hover']}
              visible={colorVisible}
              onVisibleChange={(flag) => this.setState({ colorVisible: flag })}
            >
              <div><EditorBtn type="color" text="颜色" arrow /></div>
            </Dropdown>


            <EditorBtn type="text" text="文本" onClick={() => this.setState({ operation: OPERATION_TYPE.TEXT })} />

            <Dropdown overlay={this.renderClearMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="rubber" text="清除" arrow /></div>
            </Dropdown>

            <EditorBtn type="import" text="插入" />
          </div>
          <div className={styles.middle}>
            <EditorBtn type="undo" text="撤销" onClick={this.handleUndo.bind(this)}/>
            <EditorBtn type="redo" text="重做" />

            <Dropdown overlay={this.renderScaleMenu()} placement="bottomCenter" trigger={['hover']}>
              <div><EditorBtn type="amp" text="100%" arrow /></div>
            </Dropdown>

            <EditorBtn type="save" text="保存" />
          </div>
          <div className={styles.right}>
            <EditorBtn type="locked" text="已锁" />
          </div>

        </div>
        <SketchPad
          ref={(sketchPad) => this.sketchPad = sketchPad}
          items={items}
          width={986}
          height={562}
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

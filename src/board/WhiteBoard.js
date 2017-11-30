import React from 'react'
import './white-board.css'
import SketchPad from './SketchPad'
import EditorBtn from './components/EditorBtn/EditorBtnComponent'
import { Button, Dropdown, Menu } from 'antd'

class WhiteBoard extends React.Component {

  constructor(props) {
    super(props);
  }

  state = {

  }

  componentDidMount() {

  }

  renderPenMenu() {

  }

  render() {
    const { items, onCompleteItem } = this.props

    return (
      <div className="white-board">
        <div className="editor-bar">
          <EditorBtn type="select" text="选择" arrow/>
        </div>
        <SketchPad
          items={items}
          width={986}
          height={562}
          canvasClassName="user-paper"
          onCompleteItem={onCompleteItem}
        />
      </div>
    )
  }
}

export default WhiteBoard

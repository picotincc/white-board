import React from 'react'
import './EditorBtnComponent.css'
import { Button, Dropdown, Menu } from 'antd'
import { SelectIcon } from '../../svg'

const IconMap = {
  'select': <SelectIcon fill="#926dea"/>
}

class EditorBtn extends React.Component {

  constructor(props) {
    super(props)
  }

  state = {

  }

  componentDidMount() {

  }

  render() {
    const { type, text, arrow } = this.props

    return (
      <div className="editor-btn">
        <div className="icon-container">
          <span className="icon">{IconMap[type]}</span>
          {arrow ? <div className="triangle"></div> : null}
        </div>
        <div className="icon-text">
          {text}
        </div>
      </div>
    )
  }
}

export default EditorBtn

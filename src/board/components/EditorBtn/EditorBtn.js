import React from 'react'
import styles from './EditorBtn.scss'
import classNames from 'classnames'
import { SelectIcon, StrokeIcon, ShapeIcon, ColorIcon, TextIcon, RubberIcon, ImportIcon, UndoIcon, RedoIcon, AmplificationIcon, SaveIcon, LockedIcon, UnlockIcon } from '../../svg'

const IconMap = {
  'select': <SelectIcon />,
  'stroke': <StrokeIcon />,
  'shape': <ShapeIcon />,
  'color': <ColorIcon />,
  'text': <TextIcon />,
  'rubber': <RubberIcon />,
  'import': <ImportIcon />,
  'undo': <UndoIcon />,
  'redo': <RedoIcon />,
  'amp': <AmplificationIcon />,
  'save': <SaveIcon />,
  'locked': <LockedIcon />,
  'unlock': <UnlockIcon />
}

class EditorBtn extends React.Component {

  state = {

  }

  componentDidMount() {

  }

  render() {
    const { type, text, arrow, onClick, selected } = this.props

    return (
      <div
        className={classNames({
          [styles.editorBtn]: true,
          'selected' : selected
        })}
        onClick={onClick}
      >
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{IconMap[type]}</span>
          {arrow ? <div className={styles.triangle}></div> : null}
        </div>
        <div className={styles.iconText}>
          {text}
        </div>
      </div>
    )
  }
}

export default EditorBtn

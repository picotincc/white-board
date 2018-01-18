import React from 'react'
import styles from './EditorBtn.scss'
import classNames from 'classnames'
import { Icon } from 'antd'
import { PenIcon, SelectIcon, StrokeIcon, ShapeIcon, ColorIcon, TextIcon, RubberIcon, ImportIcon, UndoIcon, RedoIcon, AmplificationIcon, SaveIcon, LockedIcon, UnlockIcon } from '../svg'

const IconMap = {
  'select': <SelectIcon />,
  'stroke': <StrokeIcon />,
  'pen': <PenIcon />,
  'straight': <div style={{ width: '22px', border: 'solid 1px #926dea', marginTop: '12px' }} />,
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
  'unlock': <UnlockIcon />,
  'eye': <Icon type="eye-o" style={{ fontSize: '24px', color: '#926dea' }}/>
}

class EditorBtn extends React.Component {

  render() {
    const { type, text, arrow, onClick, selected, color } = this.props

    return (
      <div
        className={classNames({
          [styles.editorBtn]: true,
          'selected': selected
        })}
        onClick={onClick}
      >
        <div className={styles.iconContainer}>
          <span className={styles.icon}>{IconMap[type]}</span>
          {(type === 'color') && color ? <div className={styles.colorCircle} style={{ backgroundColor: color }} ></div> : null}
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

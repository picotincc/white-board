import React from 'react'
import { v4 } from 'uuid'
import {
  List,
  fromJS
} from 'immutable'

import { TOOL_PENCIL } from './tools'
import styles from './App.scss'
import WhiteBoard from './WhiteBoard'
import { OPERATION_TYPE, REMOTE_OPERATION } from './ConstantUtil'

class App extends React.Component {

  state = {
    containerWidth: 4000,
    containerHeight: 2500,
    remoteType: REMOTE_OPERATION.INCREMENT,
    operationList: List([]), // 操作数组
    undoHistory: List([]), // 属于当前用户的 undo 的历史操作
  }

  componentDidMount() {
    // const container = this.container

    // if (container) {
    //   this.setState({
    //     containerWidth: container.offsetWidth,
    //     containerHeight: container.offsetHeight
    //   })
    // }
  }

  insertBoardOperation = (message, isLocal = false) => {
    const op = message.op
    let remoteType = REMOTE_OPERATION.DECREMENT
    const { operationList, undoHistory } = this.state

    let oItem = null
    let newUndoHistory = List([])
    let newOperationList = null

    switch (op) {
      case OPERATION_TYPE.UNDO:
        oItem = operationList.last()
        newOperationList = operationList.pop()
        if (isLocal) {
          newUndoHistory = undoHistory.push(oItem)
        } else {
          newUndoHistory = undoHistory
        }
        break
      case OPERATION_TYPE.MOVE:
        newOperationList = operationList.push(message)
        if (!isLocal) {
          newUndoHistory = undoHistory
        }
        break
      case OPERATION_TYPE.REDO:
        remoteType = REMOTE_OPERATION.INCREMENT
        if (isLocal) {
          oItem = undoHistory.last()
          newUndoHistory = undoHistory.pop()
        } else {
          oItem = message
        }
        newOperationList = operationList.push(oItem)
        break
      case OPERATION_TYPE.CLEAR_ALL:
        newOperationList = List([])
        newUndoHistory = List([])
        break
      default:
        remoteType = REMOTE_OPERATION.INCREMENT
        newOperationList = operationList.push(message)
        if (!isLocal) {
          newUndoHistory = undoHistory
        }
        break
    }

    this.setState({
      remoteType,
      operationList: newOperationList,
      undoHistory: newUndoHistory
    })
  }

  mergeOperations(operationList) {
    const data = operationList.toJS()
    let relocate = (pos, diff) => {
      pos.x = pos.x + diff.x
      pos.y = pos.y + diff.y
      const center = pos.center
      pos.center = [center[0] + diff.x, center[1] + diff.y]
      return pos
    }

    let normalItems = data.filter(item => item.op !== OPERATION_TYPE.MOVE)
    let moveItems = data.filter(item => item.op === OPERATION_TYPE.MOVE)

    normalItems.sort((a, b) => a.timestamp - b.timestamp)
    const resultItems = normalItems.map((item) => {
      moveItems.forEach((m) => {
        if (m.data.ops.indexOf(item.id) !== -1) {
          item = _moveItem(item, m.data.diff)
          item.data.position = relocate(item.data.position, m.data.diff)
        }
      })
      return item
    })
    return resultItems
  }

  addOperationItem = (item) => {
    let newItem = Object.assign({
      id: v4(),
      timestamp: Date.now()
    }, item)
    this.insertBoardOperation(newItem, true)
  }

  handleUndo = (message) => {
    const { operationList } = this.state
    if (operationList.size === 0) {
      return
    }
    this.addOperationItem(message)
  }

  handleRedo = (message) => {
    const { undoHistory } = this.state
    if (undoHistory.size === 0) {
      return
    }
    this.addOperationItem(message)
  }

  render() {
    const { containerWidth, containerHeight, operationList, remoteType } = this.state

    return (
      <div className={styles.App}>
        <div className="drawing-board" ref={(c) => this.container = c}>
          <WhiteBoard
            containerWidth={containerWidth}
            containerHeight={containerHeight}
            items={this.mergeOperations(operationList)}
            remoteType={remoteType}
            undo={this.handleUndo}
            redo={this.handleRedo}
            sendMessage={(i) => this.addOperationItem(i)}
          />
        </div>
      </div>
    )
  }
}

export default App

const _moveItem = (item, diff) => {
  const diffXFn = (x) => x + diff.x
  const diffYFn = (y) => y + diff.y

  item = fromJS(item)
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
  return item.toJS()
}
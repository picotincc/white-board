import React from 'react'
import { v4 } from 'uuid'
import {
  List,
  Map
} from 'immutable'

import styles from './App.scss'
import WhiteBoard from './WhiteBoard'
import { OPERATION_TYPE, REMOTE_OPERATION } from './ConstantUtil'

class App extends React.Component {

  state = {
    operationList: List([]),
    remoteType: REMOTE_OPERATION.INCREMENT
  }

  componentDidMount() {
    
  }

  // mergeOperationList(operationList) {
  //   const data = dataMap.toJS()
  //   let relocate = (pos, diff) => {
  //     pos.x = pos.x + diff.x
  //     pos.y = pos.y + diff.y
  //     const center = pos.center
  //     pos.center = [center[0] + diff.x, center[1] + diff.y]
  //     return pos
  //   }

  //   let normalItems = operationList.filter(item => item.get('op') !== OPERATION_TYPE.MOVE)
  //   let moveItems = operationList.filter(item => item.get('op') === OPERATION_TYPE.MOVE)

  //   normalItems = normalItems.sort((a, b) => a.get('timestamp') - b.get('timestamp'))
  //   const resultItems = fromJS(normalItems).toJS().map(item => {
  //     moveItems.forEach(m => {
  //       if (m.data.ops.indexOf(item.id) !== -1) {
  //         const diff = m.data.diff
  //         switch (item.op) {
  //           case OPERATION_TYPE.DRAW_LINE:
  //             if (item.data.tool === TOOL_PENCIL) {
  //               item.data.points = item.data.points.map(point => {
  //                 point.x = point.x + diff.x
  //                 point.y = point.y + diff.y
  //                 return point
  //               })
  //             } else {
  //               item.data.start.x = item.data.start.x + diff.x
  //               item.data.start.y = item.data.start.y + diff.y
  //               item.data.end.x = item.data.end.x + diff.x
  //               item.data.end.y = item.data.end.y + diff.y
  //             }
  //             break
  //           case OPERATION_TYPE.DRAW_SHAPE:
  //             item.data.start.x = item.data.start.x + diff.x
  //             item.data.start.y = item.data.start.y + diff.y
  //             item.data.end.x = item.data.end.x + diff.x
  //             item.data.end.y = item.data.end.y + diff.y
  //             break
  //           case OPERATION_TYPE.TEXT:
  //             let textPos = item.data.pos
  //             textPos[0] = textPos[0] + diff.x
  //             textPos[1] = textPos[1] + diff.y
  //             item.data.pos = textPos
  //             break
  //           case OPERATION_TYPE.INSERT_PIC:
  //             let pos = item.data.pos
  //             pos[0] = pos[0] + diff.x
  //             pos[1] = pos[1] + diff.y
  //             item.data.pos = pos
  //             break
  //           default:
  //             break
  //         }
  //         item.pos = relocate(item.pos, diff)
  //       }
  //     })
  //     return item
  //   })
  //   return resultItems
  // }

  addOperationItem = (item) => {
    const { operationList } = this.state
    let newItem = Map({
      id: v4(),
      timestamp: Date.now()
    }).merge(Map(item))
    this.setState({
      remoteType: REMOTE_OPERATION.INCREMENT,
      operationList: operationList.push(newItem)
    })
  }

  render() {
    const { operationList, remoteType } = this.state

    return (
      <div className={styles.App}>
        <div className={styles.header}>
          你画我猜
        </div>
        <div className={styles.container}>
          <WhiteBoard
            items={operationList.toJS()}
            undo={this.props.undo}
            redo={this.props.redo}
            onCleanAll={this.props.cleanAll}
            remoteType={remoteType}
            onCompleteItem={(i) => this.addOperationItem(i)}
          />
        </div>
        <div className={styles.footer}>
          你画我猜
        </div>
      </div>
    )
  }
}

export default App
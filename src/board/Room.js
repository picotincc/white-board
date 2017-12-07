import React from 'react'
import { fromJS } from 'immutable'
import styles from './room.scss'
import WhiteBoard from './WhiteBoard'
import { OPERATION_TYPE } from './ConstantUtil'
import { TOOL_PENCIL } from '../tools'

class Room extends React.Component {

    state = {
        role: 'presenter',
        room: null
    }

    componentDidMount() {

    }

    renderAttender(stream) {
        if (!stream || !stream.getAttributes()) {
            return null
        }

        const { username } = stream.getAttributes()
        const elementID = `stream-id-${username}`
        return (
            <div key={elementID}
              ref={() => {
                if (!stream._removed) {
                  stream.stop()
                  stream.play(elementID)
                }
              }}
              id={elementID}
              className={styles.customImage}
            >
            </div>
        )
    }

    concatDataMap(dataMap) {
        const data = dataMap.toJS()
        let relocate = (pos, diff) => {
          pos.x = pos.x + diff.x
          pos.y = pos.y + diff.y
          const center = pos.center
          pos.center = [center[0] + diff.x, center[1] + diff.y]
          return pos
        }


        let normalItems = []
        let moveItems = []
        for(let a in data) {
            let temp = data[a]
            if (temp['sketchPadItems'] && temp['sketchPadItems'].length > 0) {
              temp['sketchPadItems'].forEach(item => {
                switch (item.op) {
                  case OPERATION_TYPE.MOVE:
                    moveItems.push(item)
                    break
                  default:
                    normalItems.push(item)
                }
              })
            }
        }
        normalItems.sort((a, b) => a.timestamp - b.timestamp)
        const resultItems = fromJS(normalItems).toJS().map(item => {
          moveItems.forEach(m => {
            if (m.data.ops.indexOf(item.id) !== -1) {
              const diff = m.data.diff
              switch (item.op) {
                case OPERATION_TYPE.DRAW_LINE:
                  if (item.data.tool === TOOL_PENCIL) {
                    item.data.points = item.data.points.map(point => {
                      point.x = point.x + diff.x
                      point.y = point.y + diff.y
                      return point
                    })
                  } else {
                    item.data.start.x = item.data.start.x + diff.x
                    item.data.start.y = item.data.start.y + diff.y
                    item.data.end.x = item.data.end.x + diff.x
                    item.data.end.y = item.data.end.y + diff.y
                  }
                  break
                case OPERATION_TYPE.DRAW_SHAPE:
                  item.data.start.x = item.data.start.x + diff.x
                  item.data.start.y = item.data.start.y + diff.y
                  item.data.end.x = item.data.end.x + diff.x
                  item.data.end.y = item.data.end.y + diff.y
                  break
                case OPERATION_TYPE.TEXT:
                  let textPos = item.data.pos
                  textPos[0] = textPos[0] + diff.x
                  textPos[1] = textPos[1] + diff.y
                  item.data.pos = textPos
                  break
                case OPERATION_TYPE.INSERT_PIC:
                  let pos = item.data.pos
                  pos[0] = pos[0] + diff.x
                  pos[1] = pos[1] + diff.y
                  item.data.pos = pos
                  break
                default:
                  break
              }
              item.pos = relocate(item.pos, diff)
            }
          })
          return item
        })
        return resultItems
    }

    render() {
        const { username, roomId } = this.props

        return (
            <div className={styles.room}>
                <div className={styles.title}>
                    房间ID: {roomId}
                </div>
                <div className={styles.username}>
                    用户名：{username}
                </div>
                <div className={styles.panelTitle}>白板区</div>
                <div className={styles.sketchPadContainer}>
                  <WhiteBoard
                    items={this.concatDataMap(this.props.dataMap)}
                    undo={this.props.undo}
                    onCleanAll={this.props.cleanAll}
                    remoteType={this.props.remoteType}
                    onCompleteItem={(i) => this.props.onSendData(i)}
                  />
                </div>
                <div className={styles.panelTitle}>视频区</div>
                <div className={styles.videoList}>
                    {this.renderAttender(this.props.localStream)}
                    {this.props.streams.map(stream => this.renderAttender(stream))}
                </div>

            </div>
        )
    }
}

export default Room

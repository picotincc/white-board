import React from 'react'
import axios from 'axios'
import { v4 } from 'uuid'
import { List, Map } from 'immutable'
import '../erizo'
import { REMOTE_OPERATION, OPERATION_TYPE } from './ConstantUtil'


const serverUrl = 'https://www.menkor.cn:666'
const Erizo = window.Erizo

const connectToLicode = (Component, username) => {

  class LicodeConnection extends Component {

    state = {
      localStream: null,
      streams: List(), // Current remote streams.
      room: null, // Current room.
      dataMap: Map(),
      remoteType: REMOTE_OPERATION.INCREMENT,
    }

    componentDidMount() {
      const { roomId } = this.props
      const localStream = Erizo.Stream({
        audio: false,
        video: true,
        data: true,
        attributes: {
          username
        },
      })
      const data = {
        username,
        role: 'presenter',
        roomId
      }

      axios.post(`${serverUrl}/createToken/`, data).then(res => {
          if (res.status === 200) {
              const token = res.data
              const room = Erizo.Room({ token })

              const subscribeToStreams = (streams) => {
                  streams
                  .filter(v => v.getID() !== localStream.getID())
                  .forEach(v => room.subscribe(v))
              }

              this.setState({
                  room,
                  streams: List()
              })

              localStream.addEventListener('access-accepted', () => {
                  room.addEventListener('room-connected', roomEvent => {
                      const options = {metadata: {type: 'publisher'}}
                      room.publish(localStream, options)
                      subscribeToStreams(roomEvent.streams)
                  })

                  room.addEventListener('stream-subscribed', streamEvent => {
                      const stream = streamEvent.stream
                      stream.addEventListener('stream-data', evt => {
                          const msg = evt.msg
                          this.handleReveiveMessage(stream, msg)
                      })


                      this.setState({
                          dataMap: this.state.dataMap.set(stream.getID(), Map())
                      })

                      const streams = this.state.streams.push(stream)

                      this.setState({
                          streams,
                      })
                  })

                  room.addEventListener('stream-added', streamEvent => {
                      const streams = []
                      streams.push(streamEvent.stream)
                      subscribeToStreams(streams)
                  })

                  room.addEventListener('stream-removed', streamEvent => {
                      const stream = streamEvent.stream
                      stream._removed = true

                      if (stream) {
                          this.setState({
                              streams: this.state.streams.filter(v => v.getID() !== stream.getID())
                          })
                      }
                  })

                  room.connect()

                  this.setState({
                      localStream
                  })
              })

              localStream.init()

          }
      })
    }

    // 接受消息
    handleReveiveMessage(stream, msg) {
      const { dataMap } = this.state

      console.log('receive message', msg)
      switch (msg.op) {
        case OPERATION_TYPE.DRAW_LINE:
          this.setState({
            remoteType: REMOTE_OPERATION.INCREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg))
                          .set('undoHistory', List([])),
            )
          })
          break
        case OPERATION_TYPE.DRAW_SHAPE:
          this.setState({
            remoteType: REMOTE_OPERATION.INCREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg))
                          .set('undoHistory', List([])),
            )
          })
          break
        case OPERATION_TYPE.CLEAR:
          this.setState({
            remoteType: REMOTE_OPERATION.INCREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg))
                          .set('undoHistory', List([])),
            )
          })
          break
        case OPERATION_TYPE.TEXT:
          this.setState({
            remoteType: REMOTE_OPERATION.INCREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg))
                          .set('undoHistory', List([])),
            )
          })
          break
        case OPERATION_TYPE.INSERT_PIC:
          this.setState({
            remoteType: REMOTE_OPERATION.INCREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg))
                          .set('undoHistory', List([])),
            )
          })
          break
        case OPERATION_TYPE.MOVE:
          this.setState({
            remoteType: REMOTE_OPERATION.DECREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg))
                          .set('undoHistory', List([])),
            )
          })
          break
        case OPERATION_TYPE.UNDO:
          this.setState({
            remoteType: REMOTE_OPERATION.DECREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => {
                let undoItem = null
                return data.update('sketchPadItems', items => {
                  if (!items) {
                    return List([])
                  } else {
                    undoItem = items.last()
                    return items.pop()
                  }
                }).update('undoHistory', items => !items ? List([undoItem]) : items.push(undoItem))
              }
            )
          })
          break
        case OPERATION_TYPE.REDO:
          this.setState({
            remoteType: REMOTE_OPERATION.DECREMENT,
            dataMap: dataMap.update(
              stream.getID(),
              data => {
                let redoItem = null
                return data.update('undoHistory', items => {
                  if (!items) {
                    return List([])
                  } else {
                    redoItem = items.last()
                    console.log(redoItem)
                    return items.pop()
                  }
                }).update('sketchPadItems', items => !items ? List([redoItem]) : items.push(redoItem))
              }
            )
          })
          break
        case OPERATION_TYPE.CLEAR_ALL:
          this.setState({
            remoteType: REMOTE_OPERATION.DECREMENT,
            dataMap: dataMap.map(stream => stream.update('sketchPadItems', items => List([])).set('undoHistory', List([])))
          })
          break
        default:
          break
      }
    }

    // 发送消息
    handleSendMessage(msg) {
      // stream 是否有准备好
      const { localStream, dataMap } = this.state
      const uid = localStream.getID()
      const message = Object.assign({}, msg, {
        id: v4(),
        uid: uid,
        timestamp: Date.now()
      })
      localStream.sendData(message)
      this.setState({
        remoteType: REMOTE_OPERATION.INCREMENT,
        dataMap: dataMap.update(uid, stream => {
          if (stream) {
            return stream.update('sketchPadItems', items => !items ? List([message]) : items.push(message)).set('undoHistory', List([]))
          }
          return Map({ sketchPadItems: List([message]) })
        })
      })

      // 调用后台增加操作接口

    }

    handleUndo(msg) {
      const { localStream, dataMap } = this.state
      const uid = localStream.getID()
      const message = Object.assign({}, msg, {
        id: v4(),
        uid: uid,
        timestamp: Date.now()
      })
      const itemList = dataMap.getIn([uid, 'sketchPadItems'])
      if (itemList && itemList.size > 0) {
        localStream.sendData(message)
        this.setState({
          remoteType: REMOTE_OPERATION.DECREMENT,
          dataMap: dataMap.update(uid, stream => {
            if (stream) {
              let undoItem = null
              return stream.update('sketchPadItems', items => {
                if (!items) {
                  return List([])
                } else {
                  undoItem = items.last()
                  return items.pop()
                }
              }).update('undoHistory', items => !items ? List([undoItem]) : items.push(undoItem))
            }
            return Map({ sketchPadItems: List([]) })
          })
        })

        // 调用后台删除操作接口
      }

    }

    handleRedo(msg) {
      const { localStream, dataMap } = this.state
      const uid = localStream.getID()
      const message = Object.assign({}, msg, {
        id: v4(),
        uid: uid,
        timestamp: Date.now()
      })
      const itemList = dataMap.getIn([uid, 'undoHistory'])
      if (itemList && itemList.size > 0) {
        localStream.sendData(message)
        this.setState({
          remoteType: REMOTE_OPERATION.DECREMENT,
          dataMap: dataMap.update(uid, stream => {
            if (stream) {
              let redoItem = null
              return stream.update('undoHistory', items => {
                if (!items) {
                  return List([])
                } else {
                  redoItem = items.last()
                  return items.pop()
                }
              }).update('sketchPadItems', items => !items ? List([redoItem]) : items.push(redoItem))
            }
            return Map({ sketchPadItems: List([]) })
          })
        })
        // 调用后台增加操作接口
      }

    }

    handleCleanAll() {
      const { localStream, dataMap } = this.state
      const uid = localStream.getID()
      const message = {
        id: v4(),
        uid: uid,
        op: OPERATION_TYPE.CLEAR_ALL,
        timestamp: Date.now()
      }
      localStream.sendData(message)
      this.setState({
        remoteType: REMOTE_OPERATION.DECREMENT,
        dataMap: dataMap.map(stream => stream.update('sketchPadItems', items => List([])))
      })
    }

    handleCreateRoom(role) {
      const data = {
        username: username,
        room: Date.now().toString(),
        role,
      }

      axios.post(`${serverUrl}/createToken/`, data).then(res => console.log(res))
    }

    render() {
      return (
        <Component
          {...this.props}
          {...this.state}
          onSendData={this.handleSendMessage.bind(this)}
          dataMap={this.state.dataMap}
          room={this.state.room}
          streams={this.state.streams}
          username={username}
          undo={this.handleUndo.bind(this)}
          redo={this.handleRedo.bind(this)}
          cleanAll={this.handleCleanAll.bind(this)}
        />
      )
    }
  }

  return LicodeConnection
}

export default connectToLicode

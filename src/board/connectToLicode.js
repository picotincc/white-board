import React from 'react'
import axios from 'axios'
import { v4 } from 'uuid'
import { fromJS, List, Map } from 'immutable'
import '../erizo'
import { REMOTE_OPERATION, OPERATION_TYPE } from './ConstantUtil'


const serverUrl = 'https://www.menkor.cn:666'
const Erizo = window.Erizo

const connectToLicode = (Component, username) => {

    class LicodeConnection extends Component {

        constructor(props) {
            super(props)
        }

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
                      data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg)),
                  )
              })
              break
            case OPERATION_TYPE.CLEAR:
              this.setState({
                  remoteType: REMOTE_OPERATION.INCREMENT,
                  dataMap: dataMap.update(
                      stream.getID(),
                      data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg)),
                  )
              })
              break
            case OPERATION_TYPE.TEXT:
              this.setState({
                  remoteType: REMOTE_OPERATION.INCREMENT,
                  dataMap: dataMap.update(
                      stream.getID(),
                      data => data.update('sketchPadItems', items => !items ? List([msg]) : items.push(msg)),
                  )
              })
              break
            case OPERATION_TYPE.UNDO:
              this.setState({
                  remoteType: REMOTE_OPERATION.DECREMENT,
                  dataMap: dataMap.update(
                      stream.getID(),
                      data => data.update('sketchPadItems', items => !items ? List([]) : items.pop()),
                  )
              })
              break
            case OPERATION_TYPE.CLEAR_ALL:
              this.setState({
                remoteType: REMOTE_OPERATION.DECREMENT,
                dataMap: Map()
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
                        return stream.update('sketchPadItems', items => !items ? List([message]) : items.push(message))
                    }
                    return Map({ sketchPadItems: List([message]) })
                })
            })
        }

       handleUndo(msg) {
         const { localStream, dataMap } = this.state
         const uid = localStream.getID()
         const message = Object.assign({}, msg, {
           id: v4(),
           uid: uid,
           timestamp: Date.now()
         })
         localStream.sendData(message)
          this.setState({
              remoteType: REMOTE_OPERATION.DECREMENT,
              dataMap: dataMap.update(uid, stream => {
                  if (stream) {
                      return stream.update('sketchPadItems', items => !items ? List([]) : items.pop())
                  }
                  return Map({ sketchPadItems: List([]) })
              })
          })
        }

        handleCleanAll() {
          const { localStream } = this.state
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
               dataMap: Map()
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
                    cleanAll={this.handleCleanAll.bind(this)}
                />
            )
        }
    }

    return LicodeConnection
}

export default connectToLicode

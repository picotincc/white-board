import React from 'react'
import axios from 'axios'
import { fromJS, List, Map } from 'immutable'
import '../erizo'

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
            dataMap: Map()
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

                                this.setState({
                                    dataMap: this.state.dataMap.update(
                                        stream.getID(),
                                        data => data.update('sketchPadItems', items => !items ? List([evt.msg]) : items.push(evt.msg)),
                                    )
                                })
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

        handleSendData(data) {
            // stream 是否有准备好
            const { localStream } = this.state
            localStream.sendData(data)
            const id = localStream.getID()
            this.setState({
                dataMap: this.state.dataMap.update(id, stream => {
                    if (stream) {
                        return stream.update('sketchPadItems', items => !items ? List([data]) : items.push(data))
                    }
                    return Map({ sketchPadItems: List([data]) })
                })
            })
        }

        handleUndo() {
            const { localStream } = this.state
            const id = localStream.getID()
            this.setState({
                dataMap: this.state.dataMap.update(id, stream => {
                    if (stream) {
                        return stream.update('sketchPadItems', items => !items ? List([]) : items.pop())
                    }
                    return Map({ sketchPadItems: List([]) })
                })
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
                    onSendData={this.handleSendData.bind(this)}
                    dataMap={this.state.dataMap}
                    room={this.state.room}
                    streams={this.state.streams}
                    username={username}
                    undo={this.handleUndo.bind(this)}
                />
            )
        }
    }

    return LicodeConnection
}

export default connectToLicode

import React from 'react'
import axios from 'axios'
import { fromJS, List, Map } from 'immutable'
import './erizo'

const serverUrl = 'https://www.menkor.cn:666'
const Erizo = window.Erizo

const connectToLicode = (Component, username) => {

  class LicodeConnection extends Component {
    state = {
      roomList: List(),
      localStreamAccessAccepted: null, // Access accepted promise.
      localStream: null,
      streams: List(), // Current remote streams.
      room: null, // Current room.
      dataMap: Map(),
      isInit: true
    }

    componentDidMount() {
      const localStream = Erizo.Stream({
        audio: false,
        video: true,
        data: true,
        attributes: {
          username,
        },
      })

      const localStreamAccessAccepted = new Promise((resolve, rejected) => {
        localStream.addEventListener('access-accepted', () => {
          resolve()
        })

        localStream.init()
      })

      this.setState({
        localStreamAccessAccepted,
        localStream,
      })

      this.fetchRoomList()
    }

    fetchRoomList() {
      axios.get(`${serverUrl}/getRooms/`).then(res => {
        if (res.status === 200) {
          this.setState({
            roomList: fromJS(res.data)
          })
        }
      })
    }

    handleEnterRoom(role, roomId) {
      const data = {
        username,
        role,
        roomId,
      }

      return axios.post(`${serverUrl}/createToken/`, data).then(res => {
        if (res.status === 200) {
          const token = res.data
          const room = Erizo.Room({token: token})
          const localStream = this.state.localStream

          function subscribeToStreams(streams) {
            streams
              .filter(v => v.getID() !== localStream.getID())
              .forEach(v => room.subscribe(v))
          }

          // Init a new room contex.
          this.setState({
            room,
            streams: List()
          })

          this.state.localStreamAccessAccepted.then(() => {
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
          })

          return room
        } else {
          return null
        }
      })
    }

    handleSendData(data) {
      this.state.localStreamAccessAccepted && this.state.localStreamAccessAccepted.then(() => {
        this.state.localStream.sendData(data)
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
          onCreateRoom={this.handleCreateRoom.bind(this)}
          onEnterRoom={this.handleEnterRoom.bind(this)}
          onSendData={this.handleSendData.bind(this)}
          dataMap={this.state.dataMap}
          room={this.state.room}
          streams={this.state.streams}
          username={username}
        />
      )
    }
  }

  return LicodeConnection
}

export default connectToLicode

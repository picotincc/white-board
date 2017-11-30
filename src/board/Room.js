import React from 'react'
import './room.css'
import WhiteBoard from './WhiteBoard'
import SketchPad from './SketchPad'
import { Button } from 'antd'

class Room extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        role: 'presenter',
        room: null
    }

    componentDidMount() {
        const { role } = this.state
        const { roomId } = this.props
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
              className="custom-image"
            >
            </div>
        )
    }

    concatDataMap(dataMap) {
        const data = dataMap.toJS()
        let res = []
        for(let a in data) {
            let temp = data[a]
            if (temp['sketchPadItems'] && temp['sketchPadItems'].length > 0) {
                res = res.concat(temp['sketchPadItems'])
            }
        }
        return res;
    }

    render() {
        const { username, roomId } = this.props

        return (
            <div className="room">
                <div className="title">
                    房间ID: {roomId}
                </div>
                <div className="username">
                    用户名：{username}
                </div>
                <div className="panel-title">白板区</div>
                <div className="sketch-pad-container">
                  <WhiteBoard
                    items={this.concatDataMap(this.props.dataMap)}
                    onCompleteItem={(i) => this.props.onSendData(i)}
                  />
                </div>
                <div className="panel-title">视频区</div>
                <div className="video-list">
                    {this.renderAttender(this.props.localStream)}
                    {this.props.streams.map(stream => this.renderAttender(stream))}
                </div>

            </div>
        )
    }
}

export default Room

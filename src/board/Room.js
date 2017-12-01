import React from 'react'
import styles from './room.scss'
import WhiteBoard from './WhiteBoard'

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

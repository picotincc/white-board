import React from 'react'
import { Table, Button, Card } from 'antd'
import { List } from 'immutable'
import './App.css'
import './erizo'
import SketchPad from './SketchPad'

class App extends React.Component {
  state = {
    route: '/roomList',
    role: 'presenter',
  }

  handleEnterRoom(record) {
    this.props.onEnterRoom(this.state.role, record._id)
      .then(() => {
        this.setState({
          route: '/room',
        })
      })
  }

  renderRoomList() {
    const columns = [{
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    }]

    return (
      <div className="roomListContainer">
        <h2>Room List</h2>
        <Table
          rowKey="_id"
          pagination={false}
          columns={columns}
          dataSource={this.props.roomList.toJS()}
          onRowClick={this.handleEnterRoom.bind(this)}
        >
        </Table>
        <Button
          size="large"
          type="primary"
          onClick={() => this.props.onCreateRoom(this.state.role)}
        >
          Create room
        </Button>
      </div>
    )
  }

  renderAttender(stream, receiveData = true) {
    if (!stream) return null
    const {
      username,
    } = stream.getAttributes()

    const elementID = `stream-id-${username}`

    return (
      <Card key={elementID} style={{ width: 150 }} bodyStyle={{ padding: 0 }}>
        <div
          ref={() => {
            if (!stream._removed) {
              stream.stop()
              stream.play(elementID)
            }
          }}
          id={elementID}
          className="custom-image"
          style={{width: 150, height: 200}}
        >

        </div>
        <div className="custom-card">
          <h3>{username}</h3>
          <SketchPad
            enable={receiveData}
            items={this.props.dataMap.getIn([stream.getID(), 'sketchPadItems'], List()).toJS()}
            width={148}
            height={200}
            canvasClassName="user-paper"
            onCompleteItem={(i) => this.props.onSendData(i)}
          />
        </div>
      </Card>
    )
  }

  renderRoom() {
    return (
      <div className="videoPanel">
        { this.renderAttender(this.props.localStream, true) }
        { this.props.streams.map(stream => this.renderAttender(stream, false)) }
      </div>
    )
  }

  render() {
    let content

    switch (this.state.route) {
      case '/roomList':
        content = this.renderRoomList()
        break
      case '/room':
        content = this.renderRoom()
        break
      default:
        break
    }

    return (
      <div className="App">
        <div id="video"></div>
        {content}
      </div>
    )
  }
}

export default App

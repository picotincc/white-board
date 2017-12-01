import React from 'react'
import axios from 'axios'
import { Table, Button } from 'antd'
import { List, fromJS } from 'immutable'

import styles from './App.scss'
import Room from './Room'
import connectToLicode from './connectToLicode'
import randomWords from 'random-words'


const serverUrl = 'https://www.menkor.cn:666'

class App extends React.Component {

  state = {
      route: '/roomList',
      role: 'presenter',
      username: randomWords(),
      roomList: List()
  }

  componentDidMount() {
      this.fetchRoomList()
  }

  handleEnterRoom(record) {
      this.setState({
          selectedRoom: record._id,
          route: '/room',
      })
  }

  handleCreateRoom() {
    const data = {
      username: this.state.username,
      room: Date.now().toString(),
      role: 'presenter'
    }

    axios.post(`${serverUrl}/createToken/`, data).then(res => {
      console.log(res)
      this.fetchRoomList()
    })
  }

  fetchRoomList() {
      axios.get(`${serverUrl}/getRooms/`).then(res => {
          if (res.status === 200) {
              this.setState({
                  roomList: fromJS(res.data)
              })
          }
      }, error => {
        console.log('服务器挂了，本地调试', error)
        this.setState({
          route: '/room'
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
      <div className={styles.roomListContainer}>
        <h2>Room List</h2>
        <Table
          rowKey="_id"
          pagination={false}
          columns={columns}
          dataSource={this.state.roomList.toJS()}
          onRowClick={this.handleEnterRoom.bind(this)}
        >
        </Table>
        <Button
          size="large"
          type="primary"
          onClick={this.handleCreateRoom.bind(this)}
        >
          Create room
        </Button>
      </div>
    )
  }

  renderRoom() {
    const { selectedRoom, username } = this.state;
    const RoomWithLicode = connectToLicode(Room, username);
    return (
      <div className={styles.roomPanel}>
        <RoomWithLicode roomId={selectedRoom}/>
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
      <div className={styles.App}>
        {content}
      </div>
    )
  }
}

export default App

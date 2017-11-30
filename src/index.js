import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.min.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

// import connectToLicode from './connectToLicode'
// import randomWords from 'random-words'
// import App from './App'
// // HOC Licode App
// const AppWithLicode = connectToLicode(App, randomWords())
// ReactDOM.render(<AppWithLicode />, document.getElementById('root'))

import App from './board/App'
ReactDOM.render(<App />, document.getElementById('root'))

registerServiceWorker()

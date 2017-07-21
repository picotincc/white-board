import React from 'react'
import ReactDOM from 'react-dom'
import randomWords from 'random-words'
import 'antd/dist/antd.min.css'
import './index.css'
import App from './App'
import connectToLicode from './connectToLicode'
import registerServiceWorker from './registerServiceWorker'

const AppWithLicode = connectToLicode(App, randomWords())
ReactDOM.render(<AppWithLicode />, document.getElementById('root'))
registerServiceWorker()

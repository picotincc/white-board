// server.js (tag: v2)
const express = require('express')
const path = require('path')
const port = 3000
const publicPath = path.resolve(__dirname, 'build')
const http = require('http')

const app = express()

// We point to our static assets
app.use(express.static(publicPath))
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, './build/index.html'))
})

// And run the server
const httpServer = http.createServer(app)
httpServer.listen(port, function () {
  console.log('Server running on port ' + port)
})

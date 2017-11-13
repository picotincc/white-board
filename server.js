// server.js (tag: v2)
const express = require('express')
const path = require('path')
const fs = require('fs')
const isProduction = process.env.NODE_ENV === 'production'
const port = isProduction ? process.env.PORT : 3002
const publicPath = path.resolve(__dirname, 'build')
const https = require('https')

var privateKey = fs.readFileSync('sslcert/key.pem');
var certificate = fs.readFileSync('sslcert/cert.pem');
var credentials = {key: privateKey, cert: certificate, passphrase: 'simu'};

const app = express()

// We point to our static assets
app.use(express.static(publicPath))
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, './build/index.html'))
})

// And run the server
const httpsServer = https.createServer(credentials, app)
httpsServer.listen(port, function () {
  console.log('Server running on port ' + port)
})

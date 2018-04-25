let pool = process.env.pool || 'http://localhost:8089'
console.log('Pooling Blockchain with', pool)
const io = require('socket.io-client').connect(pool)
const {compareFace} = require('./process/compare')
const express = require('express')
const app = express()

io.on('connected', (msg) => {
	console.log(msg)
	io.emit('join_block', ['Setro', 'Demostrasi'])
})

// // SEND DATA COMPARE
// io.emit('hash', {block : 'setro', hash : 'hello', image_url1 : 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Russia-Portugal_CC2017_%2811%29_%28cropped%29.jpg/250px-Russia-Portugal_CC2017_%2811%29_%28cropped%29.jpg', image_url2 : 'http://givemesport.azureedge.net/images/17/12/29/a4c6f7af051d676d08174d89f4daffa5/960.jpg'})

io.on('hash', (data) => {
    if (data.hash && data.image_url1 && data.image_url2) {
        // VALIDATE FACES
        console.log('Hashing face', data.hash, 'on block', data.block)
        compareFace(data).then((json) => {
            // VERIFY DATA AND SEND TO BLOCKCHAIN
            console.log('Hashing face', data.hash, 'on block', data.block, ' ==> success')
            io.emit('transaction', {json, hash : data.hash})
        }).catch((e) => {
            console.log('Hashing face', data.hash, 'on block', data.block, ' ==> failed')
            io.emit('hash', data)
        })
    }
})

// LISTEN ON PORT
let port = process.env.PORT || 8091
app.listen(port, () => 'Listening on port', port)

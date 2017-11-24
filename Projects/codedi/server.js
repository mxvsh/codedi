console.log("\033c");
const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const PORT = process.env.PORT || 8080;
const server = express()
  .use('/', express.static(path.join(__dirname, 'public')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', function(client) {
	console.log(client.id);
	client.emit('id', client.id);
	client.on('text', function(data) {
		console.log(data.text)
		io.emit('text', data);
	});
	client.on('cmd', function(data) {
		console.log(data.text)
		io.emit('cmd', data);
	});
	
});

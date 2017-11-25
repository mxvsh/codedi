console.log("\033c");
var port = process.argv[2];

var express = require('express');
var app = express();
var path = require('path');
var io = require('socket.io')(app.listen(port));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
})
.use(express.static(path.join(__dirname, '/public')));

app.get('/join/:userID', function(req, res) {
	console.log(req.params.userID);
	io.to(req.param('userID')).emit('user_joined');
	res.redirect('http://127.0.0.1:8080/index.html?joinedTo='+req.param('userID'));
});

console.log('Listening on port ' + port);

io.on('connection', function(client) {
	client.emit('id', client.id);
	var config = {};
	config.id = client.id;
	config.inGroup = client.id;
	console.log(client.id+' joined');
	client.on('joinMeTo', function(data) {
		console.log("Joining "+client.id+" in  ["+data+"]");
		config.inGroup = data;
		client.join(data);
		client.broadcast.to(data).emit('user_joined')
	});
	client.on('disconnect', function() {
		console.log("One user left the group: "+config.inGroup)
		client.broadcast.to(config.inGroup).emit('dc');
	})
	client.join(client.id);
	
	client.on('text', function(data) {
		console.log("EMITing in: "+config.inGroup);
		io.to(config.inGroup).emit('text', data);
	});
	client.on('cmd', function(data) {
		console.log(JSON.stringify(data));
		io.to(client.inGroup).emit('cmd', data);
	});
});
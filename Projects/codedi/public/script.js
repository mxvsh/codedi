var socket = '';

socket = io();
var isConnected = false;
socket.on("connect", function() {
	isConnected = true;
})
socket.on('disconnect', function() {
	isConnected = false;
});
socket.on('id', function(data){
	dicode.user_connect("eth4kr", data);	
	console.log("Connected with ID: "+data);
});

var temp_text = '';
document.onkeypress = function(e) {
	if(!isConnected) return;
	var user_1 = document.getElementById('user_one_editor');
	if(e.charCode >= 34) {
		if(user_1.value == "") {
			dicode.emit_command('clear_all');
		} else
		dicode.emit_text(e.key)
	}
	if(e.keyCode == 8) {
		dicode.emit_command('backspace')
	}
} 
socket.on('cmd', function(data) {
	console.log(data);
	var user_2 = document.getElementById('user_two_editor');
	switch(data.text) {
		case 'backspace':
			user_2.value = user_2.value.slice(0, -1);
			break;
		case 'clear_all':
			user_2.value = "";
	}
})
socket.on('text', function(data) {
	console.log(data)
	//if(data.username == dicode.username){
		document.getElementById('user_two_editor').value += data.text;
	//}
})

var dicode = {
	user_connect: function(username, id) {
		this.username = username;
		this.id = id;
	},
	emit_command: function(command) {
		var json = {
			'username': this.username,
			'id':this.id,
			'text':command
		}
		socket.emit('cmd', json);
	},
	emit_text: function(text) {
		var json = {};
		json.username = this.username;
		json.id = this.id;
		json.text = text;

		socket.emit('text', json);
	}
}

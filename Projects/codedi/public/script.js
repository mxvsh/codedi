var socket = io();
$(".togglebutton").hide();
var code = "";
var temp = "";
var url_string = window.location.href;
var url = new URL(url_string);
var c = url.searchParams.get("joinedTo");

var isConnected = false;
var isHost = true;

socket.on("connect", function() {
	isConnected = true;
	$("#alias_host").html("<font color=green>Host</font>");
})
socket.on('disconnect', function() {
	isConnected = false;
	$("#alias_host").html("<font color=red>Disconnected</font>");
});
socket.on("dc", function() {
	if(isHost)
		$("#alias_client").html("<font color=red>Client (Disconnected)</font>");
	else
		$("#alias_client").html("<font color=red>Host (Disconnected)</font>");
})
socket.on('id', function(data){
	if(c) {
		$("#alias_host").html("Client");
		isHost = false;
		socket.emit('joinMeTo', c);
		dicode.user_connect("client", data);
		$("#alias_client").html("<font color=green>Host (Connected)</font>");
	}else { 
		dicode.user_connect("host", data);
		
		console.log("Connected with ID: "+data);
		$("#join_link").html("Link:, "+"http://127.0.0.1:8080/join/"+data);
	}
});

document.onkeypress = function(e){
	if(e.ctrlKey) return;
	var focused = document.activeElement;
	if(!isConnected) return;
	var host = document.getElementById('host_editor');
	var message_box = $("#msg_box");
	if(focused != host || focused != message_box) return true;
	if(e.keyCode == 13 && focused == message_box) {
		dicode.emit_message();
	}
	if(e.keyCode == 9) { //tab
		host.value += "      ";
		$("#host_editor").focus();
	}
	if(e.charCode >= 30) {
		if(host.value == "") {
			dicode.emit_command('clear_all');
		}
	}
	if(e.keyCode == 8) {
		dicode.emit_command('backspace');
	}
}
setInterval(function() {
	if(temp != code) {
		console.log("changed");
		console.log(temp)
		temp = code;
		console.log(temp)
	}
}, 200);
socket.on('cmd', function(data) {
	console.log(data);
	var client = document.getElementById('client_editor');
	switch(data.text) {
		case 'backspace':
			client.value = client.value.slice(0, -1);
			break;
		case 'clear_all':
			client.value = "";
			break;
	}
});
socket.on('user_joined', function(data) {
	$("#alias_client").html('<font color=green>Client (Connected)</font>');
})
socket.on('text', function(data) {
	console.log(data)
	if(data.username != dicode.username){
		document.getElementById('client_editor').value = data.text;
	}
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
	},
	emit_message: function() {
		var msg = $("#message_box").val();
		var json = {};
		json.username = this.username;
		json.id = this.id;
		json.text = msg;
	}
}

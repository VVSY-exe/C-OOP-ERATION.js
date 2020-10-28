$(function() {
    var socket = io();
    $('form').submit(function (e) {
        e.preventDefault(); //prevent page reload whenever form is submitted
        socket.emit('chat message', $('#m').val()); //emit message to the server
        $('#m').val(''); //empty form input after sending message
        return false;
    });
    socket.on('chat message', function(data) {
        $('#messages').append($('<li>').text(`${data.user} at ${data.timestamp}: ${data.msg}`));
    });
    socket.on('user connect', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });
    socket.on('user disconnect', function(msg) {
        $('#messages').append($('<li>').text(msg));
    });
});
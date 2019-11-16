var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let value = {
    document: {
      nodes: [
        {
          object: 'block',
          type: 'paragraph',
          nodes: [
            {
              object: 'text',
              text: 'Hello coders',
            },
          ],
        },
      ],
    },
}

io.on('connection', function(socket){
  socket.on('new-client-join', () => {
    console.log('initial state')
    io.emit('initial-state', value)
  })
  socket.on('new-operations', data => {
    console.log('Got a new event from'+data.editorId)
    // console.log(JSON.stringify(data))
    value = data.value
    io.emit('new-remote-operations', data)
  })
  console.log('a user connected');
});

http.listen(4000, function(){
  console.log('listening on *:4000');
});

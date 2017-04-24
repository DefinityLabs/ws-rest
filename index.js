const request = require('request-promise');
const client = require('./lib/client');

function wsRest(app, uri = '/ws') {
  const ws = require('express-ws')(app);

  app.ws(uri, function(ws, req, next){
    ws.on('message', function(msg){
      let json = JSON.parse(msg);
      request(json.data)
        .then(function(data){
          let message = {messageId: json.messageId, timestamp: new Date(), data: data};
          ws.send(JSON.stringify(message), function(err){
            if (err) {
              console.log('cannot send message:', message, err);
            }
          });
        }).catch(function(error) {
          let message = {messageId: json.messageId, timestamp: new Date(), error: error};
          ws.send(JSON.stringify(message), function(err){
            if (err) {
              console.log('cannot send message:', message, err);
            }
          });
        });
    });
    next();
  });

}

function sendMessage(ws, message) {
  if (ws.readyState === 1) {
    try {
      ws.send(message);
    } catch (e) {
      console.log('throw error');
    }
  } else {
    console.log('trying to send: ' + message['messageId']);
    setTimeout(function(){
      sendMessage(ws, message);
    }, 100);
  }
}

module.exports = {
  use: wsRest,
  wsRestClient: client
};

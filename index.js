const request = require('request-promise');
const client = require('./lib/client');

function wsRest(app, uri = '/ws') {
  const ws = require('express-ws')(app);

  app.ws(uri, function(ws, req){
    ws.on('message', function(msg){
      let json = JSON.parse(msg);
      request({uri: json.data.url, method: json.data.method}).then(function(data){
        ws.send(JSON.stringify({messageId: json.messageId, timestamp: new Date(), data: data}));
      });
    });
  });

}

module.exports = {
  use: wsRest,
  wsRestClient: client
};
